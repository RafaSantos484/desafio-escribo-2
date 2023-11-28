import { v4 } from "uuid";
import bcrypt from "bcrypt";
import { generateJwt, readUsersOnFile, writeUsersOnFile } from "../utils";

type phone = { ddd: string; number: string };

export type UserType = {
  password: string;
  name: string;
  email: string;
  phones: phone[];
  creationDate: Date;
  updateDate: Date;
  lastLoginDate: Date;
};

export default class User {
  private name: string;
  private email: string;
  private phones: phone[];
  private password: string;
  private creationDate: Date;
  private updateDate: Date;
  private lastLoginDate: Date;

  constructor(
    name: string,
    email: string,
    phones: phone[],
    password = "",
    dates?: { creationDate: Date; updateDate: Date; lastLoginDate: Date }
  ) {
    this.name = name;
    this.email = email;
    this.phones = phones;
    this.password = password;

    if (!dates) {
      const currentDate = new Date();
      this.creationDate = this.updateDate = this.lastLoginDate = currentDate;
    } else {
      this.creationDate = dates.creationDate;
      this.updateDate = dates.updateDate;
      this.lastLoginDate = dates.lastLoginDate;
    }
  }

  toObj(): UserType {
    return {
      email: this.email,
      name: this.name,
      phones: this.phones,
      password: this.password,
      creationDate: this.creationDate,
      updateDate: this.updateDate,
      lastLoginDate: this.lastLoginDate,
    };
  }

  // Diz se o email já está em uso
  static emailIsUsed(email: string) {
    return (
      Object.values(users).findIndex((user) => user.email === email) !== -1
    );
  }

  register(password: string) {
    if (User.emailIsUsed(this.email)) throw "E-mail já existente";

    const id = v4();
    const encryptedPassword = bcrypt.hashSync(password, 10);
    this.password = encryptedPassword;
    users[id] = this;

    try {
      writeUsersOnFile();
    } catch (err) {
      delete users[id];
      throw err;
    }

    const token = generateJwt(this.toObj());
    return {
      id,
      data_criacao: this.creationDate,
      data_atualizacao: this.updateDate,
      ultimo_login: this.lastLoginDate,
      token,
    };
  }

  // Retorna o objeto do usuário que tem o email igual a 'email'
  // Cajo esse usuário não exista, retorna 'undefined'
  static getUserIdWithEmail(email: string) {
    return Object.keys(users).find((key) => users[key].email === email);
  }

  login(password: string) {
    if (!bcrypt.compareSync(password, this.password))
      throw "Usuário e/ou senha inválidos";

    // Atualiza data de último login e salva em 'users.json'
    this.lastLoginDate = new Date();
    writeUsersOnFile();

    return {
      data_criacao: this.creationDate,
      data_atualizacao: this.updateDate,
      ultimo_login: this.lastLoginDate,
      token: generateJwt(this.toObj()),
    };
  }
}

// Dicionário que relaciona IDs aos objetos dos usuários
export const users: { [id: string]: User } = readUsersOnFile();
console.log(users);
