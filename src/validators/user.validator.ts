import { body } from "express-validator";

// Conjunto de objetos 'ValidationChain' da lib 'express-validator'
// Valida o body das requisições

export const userBasicInfoValidations = [
  body("nome")
    .exists()
    .withMessage("Campo 'nome' faltando")
    .isString()
    .withMessage("Campo 'nome' deve ser string")
    .trim()
    .isLength({ min: 3, max: 50 })
    .withMessage((value) => `Nome ${value} inválido`),
  body("email")
    .exists()
    .withMessage("Campo 'E-mail' faltando")
    .isString()
    .withMessage("Campo 'E-mail' deve ser string")
    .trim()
    .isEmail()
    .withMessage((value) => `E-mail ${value} inválido`),
  body("telefones")
    .exists()
    .withMessage("Campo 'telefones' faltando")
    .isArray({ min: 1 })
    .withMessage(
      "Campo 'telefones' deve ser um array com ao menos um elemento"
    ),
  body("telefones.*")
    .isObject()
    .withMessage("Telefones devem ser objetos contendo número e ddd")
    .custom((value) => {
      for (const key of Object.keys(value))
        if (key !== "ddd" && key !== "numero") return false;
      return true;
    })
    .withMessage("Telefones devem conter apenas campos 'ddd' e 'numero'"),
  body("telefones.*.ddd")
    .exists()
    .withMessage("Campo 'ddd' faltando")
    .isString()
    .withMessage("Campo 'ddd' deve ser string")
    .trim()
    // Regex de ddd -> string de 2 dígitos não começando com 0
    .custom((value) => /^[1-9]\d$/.test(value))
    .withMessage((value) => `DDD ${value} inválido`),
  body("telefones.*.numero")
    .exists()
    .withMessage("Campo 'numero' faltando")
    .isString()
    .withMessage("Campo 'numero' deve ser string")
    .trim()
    // Regex de numero -> string de tamanho 9 contendo dígitos
    .custom((value) => /^\d{9}$/.test(value))
    .withMessage((value) => `Número ${value} inválido`),
];

export const userEmailValidations = [
  body("email")
    .exists()
    .withMessage("Campo 'E-mail' faltando")
    .isString()
    .withMessage("Campo 'E-mail' deve ser string")
    .trim()
    .isEmail()
    .withMessage((value) => `E-mail ${value} inválido`),
];

export const userPasswordValidations = [
  body("senha")
    .exists()
    .withMessage("Campo 'senha' faltando")
    .isString()
    .withMessage("Campo 'senha' deve ser string")
    .trim()
    // Regex da senha -> string de tamanho 6 a 15 contendo letas, dígitos e alguns caracteres especiais
    .custom((input) => /^[a-zA-Z0-9.@!#$]{6,15}$/.test(input))
    .withMessage("Senha inválida"),
];
