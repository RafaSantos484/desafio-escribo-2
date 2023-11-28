import fs from "fs";
import jwt from "jsonwebtoken";
import User, { UserType, users } from "./models/user.model";

export function generateJwt(payload: any) {
  return jwt.sign(payload, process.env.JWT_SECRET as string, {
    expiresIn: "30m",
  });
}

export function decodeJwt(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string) as any;
  } catch (error: any) {
    if (error.message === "jwt expired") throw "Sessão inválida";
    throw "Não autorizado";
  }
}

// Salva dicionário 'users' no arquivo 'users.json'
export function writeUsersOnFile() {
  const usersObj: { [id: string]: UserType } = {};
  for (const [id, user] of Object.entries(users)) {
    usersObj[id] = user.toObj();
  }

  const jsonStrUsers = JSON.stringify(usersObj, null, 2);
  try {
    fs.writeFileSync("users.json", jsonStrUsers, { encoding: "utf-8" });
  } catch (err) {
    console.log(err);
    throw "Falha ao tentar salvar usuários em 'users.json'";
  }
}

// Retorna dicionário de usuários com valores salvos em 'users.json'
export function readUsersOnFile() {
  try {
    const data = fs.readFileSync("users.json", { encoding: "utf-8" });
    const usersObj = JSON.parse(data) as { [id: string]: UserType };
    const newUsers: any = {};
    for (const [id, userObj] of Object.entries(usersObj)) {
      newUsers[id] = new User(
        userObj.name,
        userObj.email,
        userObj.phones,
        userObj.password,
        {
          creationDate: userObj.creationDate,
          updateDate: userObj.updateDate,
          lastLoginDate: userObj.lastLoginDate,
        }
      );
    }
    return newUsers;
  } catch (err) {
    console.log(err);
    console.log(
      "Falha ao tentar ler usuários em 'users.json', retornando objeto vazio"
    );
    return {};
  }
}
