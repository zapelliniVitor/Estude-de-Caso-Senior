# EstudoDeCaso-Senior
Documentação

1. Introdução
1.1 Objetivo

O objetivo deste projeto é desenvolver um sistema de gerenciamento de clientes e contatos que permita adicionar, editar, excluir e visualizar clientes e seus respectivos contatos. O sistema também oferece funcionalidades para geração de relatórios em PDF e Excel.
2. Ambiente de Desenvolvimento
2.1 Ferramentas Utilizadas

    IDE: Visual Studio Code
    Versionamento: Git
    Linguagem: TypeScript
    Framework: Angular
    Bibliotecas:
        jspdf para geração de PDFs
        jspdf-autotable para formatação de tabelas em PDFs
        xlsx para geração de arquivos Excel
        file-saver para salvar arquivos gerados no navegador
        ngx-pagination para paginação de listas

3. Arquitetura do Sistema
3.1 Estrutura de Diretórios

lua

src/
|-- app/
|   |-- cliente-lista/
|   |-- cliente-form/
|   |-- contato-lista/
|   |-- contato-form/
|   |-- login/
|   |-- main/
|   |-- register/
|   |-- models/
|   |-- services/
|   |-- guards/
|   |-- app-routing.module.ts
|   |-- app.component.ts
|   |-- app.module.ts

3.2 Componentes Principais

    ClienteListaComponent: Exibe a lista de clientes com opções para editar, excluir, gerar PDF e Excel.
    ClienteFormComponent: Formulário para adicionar e editar clientes.
    ContatoListaComponent: Exibe a lista de contatos com opções para editar, excluir, gerar PDF e Excel.
    ContatoFormComponent: Formulário para adicionar e editar contatos.
    LoginComponent: Formulário de login.
    RegisterComponent: Formulário de registro de novos usuários.
    MainComponent: Componente principal que gerencia a navegação e a exibição da navbar.

4. Funcionalidades Implementadas
4.1 Gerenciamento de Clientes

    Adicionar Cliente
    Editar Cliente
    Excluir Cliente
    Visualizar lista de Clientes
    Paginação da lista de Clientes
    Gerar relatórios de Clientes em PDF
    Gerar relatórios de Clientes em Excel

4.2 Gerenciamento de Contatos

    Adicionar Contato
    Editar Contato
    Excluir Contato
    Visualizar lista de Contatos
    Paginação da lista de Contatos
    Gerar relatórios de Contatos em PDF
    Gerar relatórios de Contatos em Excel

4.3 Autenticação

    Login de usuários
    Registro de novos usuários
    Autenticação de rotas usando AuthGuard

5. Tecnologias Utilizadas

    Angular: Framework principal utilizado para desenvolvimento do frontend.
    TypeScript: Linguagem de programação utilizada.
    jspdf: Biblioteca utilizada para geração de PDFs.
    jspdf-autotable: Biblioteca utilizada para formatação de tabelas em PDFs.
    xlsx: Biblioteca utilizada para geração de arquivos Excel.
    file-saver: Biblioteca utilizada para salvar arquivos gerados no navegador.
    ngx-pagination: Biblioteca utilizada para paginação de listas.

6. Testes
6.1 Estrutura de Testes

Os testes foram implementados para cobrir os principais componentes e serviços do sistema, garantindo que as funcionalidades críticas funcionem conforme esperado.
6.2 Testes de Componentes

    ClienteListaComponent: Testes para verificar a exibição da lista de clientes, navegação para edição e exclusão de clientes, e geração de relatórios.
    ClienteFormComponent: Testes para adicionar e editar clientes, validação de campos obrigatórios.
    ContatoListaComponent: Testes para verificar a exibição da lista de contatos, navegação para edição e exclusão de contatos, e geração de relatórios.
    ContatoFormComponent: Testes para adicionar e editar contatos, validação de campos obrigatórios.
    LoginComponent: Testes para login de usuário, validação de credenciais.
    RegisterComponent: Testes para registro de novos usuários, validação de campos obrigatórios e confirmação de senha.
    MainComponent: Testes para exibição e ocultação da navbar com base na rota atual, funcionalidade de logoff.

6.3 Testes de Serviços

    ClienteService: Testes para adicionar, editar, excluir e recuperar clientes do localStorage, geração de relatórios em PDF e Excel.
    ContatoService: Testes para adicionar, editar, excluir e recuperar contatos do localStorage, geração de relatórios em PDF e Excel.
    AuthGuard: Testes para garantir que apenas usuários autenticados possam acessar certas rotas.

6.4 Comando para Executar os Testes

Para executar os testes, utilize o seguinte comando no terminal:

ng test

7. Conclusão

Este projeto demonstrou a implementação de um sistema de gerenciamento de clientes e contatos com funcionalidades de autenticação, gerenciamento de dados e geração de relatórios. A utilização de Angular como framework, juntamente com bibliotecas de terceiros para geração de arquivos e paginação, mostrou-se eficiente para atender aos requisitos do sistema. Os testes unitários garantem a qualidade e a confiabilidade das funcionalidades implementadas.
