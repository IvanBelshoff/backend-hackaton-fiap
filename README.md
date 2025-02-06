# Gerador de Planos de Aula com IA - Backend

Este repositório contém o código-fonte do backend para o projeto "Gerador de Planos de Aula com IA", uma ferramenta desenvolvida para auxiliar professores na criação de planos de aula personalizados de forma rápida e eficiente.

## Funcionalidades
- Autenticação de Usuários: Permite que professores realizem cadastro e login na plataforma.
- Geração de Planos de Aula: A partir de informações fornecidas pelo usuário, como tema da aula, nível escolar e duração, o sistema utiliza uma API de inteligência artificial para gerar um plano de aula personalizado.
- Repositório de Planos: Os professores podem gerenciar seus planos de aula.

## Tecnologias Utilizadas

- Linguagem: Typescript, HTML
- Framework:  Express, NodeJS
- Banco de Dados: PostgreSQL
- Outras Tecnologias: TypeORM, Multer, JWToken, NodeMailer

## Pré-requisitos
- NodeJS versão: v20.13.1 ou posterior

## Instalação
#### Clone o repositório:

```bash
git clone https://github.com/IvanBelshoff/backend-hackaton-fiap.git
cd backend-hackaton-fiap
```

#### Instale as dependências:

```bash
yarn dev
# ou
npm run dev
```
#### Banco de dados

1. Crie um banco de dados usando: https://www.pgadmin.org/download/ 
ou usando container do docker: https://hub.docker.com/_/postgres

#### Configuração do Ambiente:

- Crie um arquivo .env na raiz do projeto.
- Copie o conteúdo do arquivo .env.exemple para o .env:

```bash
cp .env.exemple .env
```
- Preencha as variáveis de ambiente no arquivo .env conforme necessário.
- Certifique-se de configurar as variáveis para conexão com banco de dados de acordo com as informações fornecidas no .env.exemple

## Uso

1. Gere um arquivo de migração que servira para modelar o banco de dados de acordo com as entidades:

```bash
yarn migration:generate
# ou
npm run migration:generate
```

2. Execute a migração:

```bash
yarn migration:run
# ou
npm run migration:run
```

3. Inicie o servidor:

```bash
yarn start
# ou
npm run start
```
4. Acesse a aplicação:

- O servidor estará rodando em: http://localhost:[porta_definida]

## Contribuição
Contribuições são bem-vindas! Siga os passos abaixo:

1. Faça um fork do repositório.
2. Crie uma nova branch (git checkout -b minha-feature).
3. Commit suas alterações (git commit -m 'Adiciona nova funcionalidade').
4. Envie para o repositório (git push origin minha-feature).
5. Abra um Pull Request.
