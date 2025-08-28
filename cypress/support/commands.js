// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('createUser', (email, admin) => {
  return cy.request({
    method: 'POST',
    url: 'https://serverest.dev/usuarios',
    body: {
      nome: 'Usuário Teste',
      email,
      password: 'Senha@123',
      administrador: admin 
    }
  })
})

Cypress.Commands.add('getToken', (email, password = 'Senha@123') => {
    return cy.request('POST', 'https://serverest.dev/login', {
        email,
        password
    }).then((response) => {
        expect(response.status).to.eq(200)
        return cy.wrap(response.body.authorization) // corrigido!
    })
})