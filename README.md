# SISCONEF - Sistema de Controle de Pessoal

### Versão 2.0

SISCONEF é um sistema web desenvolvido para o controle de pessoal de uma Organização Militar do Exército Brasileiro.
O sistema permite gerenciar destinos, férias, funções e outras informações relacionadas ao efetivo militar.

## Tecnologias Utilizadas
- **Laravel** (Backend)
- **React** (Frontend)
- **Axios, SweetAlert2, Bootstrap** (Bibliotecas auxiliares)
- **Moment.js, jsPDF** (Manipulação de datas e geração de PDFs)

## ⚙️ Instalação

### 1. Instalar Laravel
```sh
composer create-project --prefer-dist laravel/laravel crud-react-laravel
```

### 2. Instalar React
```sh
npx create-react-app crud-react
```

### 3. Instalar dependências
```sh
npm install axios react-bootstrap bootstrap
npm install react-router-dom sweetalert2 --save
npm install --save moment react-moment
npm install jspdf jspdf-autotable
```

### 4. Configuração do Banco de Dados
Para evitar o erro de `Attempt id`, insira no banco de dados o destino `PRONTO`.

### 5. Atualização das Dependências
```sh
composer update  # Para atualizar o Laravel
npm install      # Para atualizar as dependências do React
```

### 6. Correção de Logo
Caso o logo não apareça, copie o arquivo `logo.png` do frontend para o backend:
```sh
cp frontend/src/assets/logo.png backend/storage/logo.png
```

---

## 💻 Desenvolvedores
[#astraeus917](https://github.com/astraeus917)

[#jhonathandelgado16](https://github.com/jhonathandelgado16)

---

## 📄 Licença
Este projeto está sob a licença CC-BY-NC-SA-4.0 – veja o arquivo [CC-BY-NC-SA-4.0](CC-BY-NC-SA-4.0) para mais detalhes.

---

## 📞 Contato
Para mais informações ou suporte, entre em contato com os desenvolvedores do projeto.

