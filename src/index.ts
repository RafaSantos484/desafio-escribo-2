import express from "express";
import "dotenv/config";
import { validationResult } from "express-validator";
import User, { users } from "./models/user.model";
import {
  userBasicInfoValidations,
  userEmailValidations,
  userPasswordValidations,
} from "./validators/user.validator";
import { decodeJwt } from "./utils";

const app = express();
app.use(express.json());
const port = process.env.PORT || 3000;

// Middleware para verificar o Content-Type
app.use((req, res, next) => {
  // Aceita apenas Content-Type === application/json
  if (req.headers["content-type"]?.toLowerCase() !== "application/json")
    return res.status(400).json({ mensagem: "Header 'content-type' inválido" });

  next();
});

// Rota GET de ping
app.get("/", (req, res) => res.status(200).json({ mensagem: "Olá Mundo!" }));

// Rota POST de criar usuário
app.post(
  "/usuario",
  userBasicInfoValidations.concat(userPasswordValidations),
  (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json({ mensagem: msg });
    }

    const { nome, email, senha, telefones } = req.body;
    const newUser = new User(nome, email, telefones);
    try {
      const response = newUser.register(senha);
      res.status(200).json(response);
    } catch (err) {
      res.status(400).json({ mensagem: err });
    }
  }
);

// Rota GET de obter info do usuário
// Requer um token gerado pela rota de login
app.get("/usuario", (req, res) => {
  const headerAuth = req.headers["authentication"];
  if (typeof headerAuth !== "string")
    return res.status(401).json({ mensagem: "Não autorizado" });

  const authSplit = headerAuth.split(" ");
  if (authSplit.length !== 2 || authSplit[0] !== "Bearer")
    return res.status(401).json({ mensagem: "Não autorizado" });

  const token = authSplit[1];
  try {
    const userInfo = decodeJwt(token);
    const id = User.getUserIdWithEmail(userInfo["email"]);
    res.status(200).json({
      id,
      email: userInfo["email"],
      nome: userInfo["name"],
      telefones: userInfo["phones"],
      data_criacao: userInfo["creationDate"],
      data_atualizacao: userInfo["updateDate"],
      ultimo_login: userInfo["lastLoginDate"],
    });
  } catch (err) {
    res.status(401).json({ mensagem: err });
  }
});

// Rota GET de login
app.get(
  "/login",
  userEmailValidations.concat(userPasswordValidations),
  (req: any, res: any) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const { msg } = errors.array()[0];
      return res.status(400).json({ mensagem: msg });
    }

    const { email, senha } = req.body;
    const id = User.getUserIdWithEmail(email);
    // Nenhum usuário com esse email
    if (!id) {
      return res.status(400).json({ mensagem: "Usuário e/ou senha inválidos" });
    }

    const user = users[id];
    try {
      const response = user.login(senha);
      res.status(200).json({ id, ...response });
    } catch (err) {
      res.status(400).json({ mensagem: err });
    }
  }
);

app.listen(Number(port), () => console.log(`App listening on port ${port}`));
