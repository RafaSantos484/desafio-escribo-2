# Desafio 2 - Escribo

### Descrição do problema

Desenvolver uma API RESTful para autenticação de usuários, que permita operações de cadastro (sign up), autenticação (sign in) e recuperação de informações do usuário.

### Descrição da Solução

- A API foi desenvolvida em **TypeScript** utilizando **Node.js** com **express**.
- O repositório contém o arquivo `users.json` para simular um banco de dados e salvar os dados durante o uso da API.
- Os tokens são gerados usando a lib **jsonwebtoken** e expiram em 30 minutos.
- As senhas são criptografadas usando a lib **bcrypt**.
- A validação do `body` das requisições é feito usando a lib **express-validator**.

## Documentação da API

#### Ping

```http
  GET /
```

- Resposta:

```json
{
  "mensagem": "Olá Mundo!"
}
```

#### Cadastrar Usuário

```http
  POST /usuario
```

- `Body` da Requisição:

```json
{
    "email": string,
    "nome": string,
    "senha": string,
    "telefones": {"ddd": string, "numero": string}[]
}
```

- Resposta:

```json
{
    "id": string,
    "data_criacao": Date,
    "data_atualizacao": Date,
    "ultimo_login": Date,
    "token": string
}
```

#### Buscar usuário

```http
  GET /usuario
```

- `Header` obrigatório:

```json
{
  "authentication": "Bearer {token}"
}
```

- Resposta:

```json
{
    "id": string,
    "email": string,
    "nome": string,
    "telefones": {"ddd": string, "numero": string}[],
    "data_criacao": Date,
    "data_atualizacao": Date,
    "ultimo_login": Date,
}
```

#### Login

```http
  GET /login
```

- `Body` da Requisição:

```json
{
    "email": string,
    "senha": string,
}
```

- Resposta:

```json
{
    "id": string,
    "data_criacao": Date,
    "data_atualizacao": Date,
    "ultimo_login": Date,
    "token": string
}
```

## Variáveis de Ambiente

O projeto utiliza as seguintes variáveis de ambiente:

- `PORT` (**Não-Obrigatório**): Porta onde o servidor irá rodar. Caso não seja definido, irá utilizar a porta 3000.

- `JWT_SECRET` (**Obrigatório**): Secret que será utilizada para gerar os JWTs.

## URL para testes

Pode-se testar a API através da seguinte URL:  
`...`

- **ATENÇÃO**: O serviço que está hospedando esta API entra em hibernação caso não receba requisições por 15 minutos. Ao receber requisições enquanto está hibernando, ele demora um pouco para voltar ao ar. Antes de testar a API, envie requisições para a rota de ping `GET /` até que haja resposta.
