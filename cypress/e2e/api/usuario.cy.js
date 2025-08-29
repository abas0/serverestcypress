// Cadastrar um usuário com sucesso e pesquisá-lo na lista de usuários

import { criarUsuarioSucesso } from "../../support/utils";

describe("POST /usuarios", () => {
    let userId;
    let email;
    it("Cadastrar um usuário com sucesso", () => {
        criarUsuarioSucesso("true").then((user) => {
            email = user.email;
            userId = user.userId;

            // pesquisar pelo ID o usuário recém criado 
            cy.request({
                method: "GET",
                url: `${Cypress.env("API_URL")}/usuarios/${userId}`
            }).then((response) => {
                expect(response.status).to.eq(200);
                expect(response.body).to.have.property('nome', 'Beatriz Teste');
                expect(response.body).to.have.property('email', email);
                expect(response.body).to.have.property('administrador', 'true');
            });
        });
    });
    after(() => {
        // condição só é rodada caso o userId passe a ser um valor válido
        if(userId){
            cy.request({
                method: "DELETE", 
                url: `${Cypress.env("API_URL") || "https://serverest.dev"}/usuarios/${userId}`
            })
        .then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.eq('Registro excluído com sucesso')
        })
        }
    })
});