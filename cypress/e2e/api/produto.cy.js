// Tentar cadastrar um produto não sendo admin
import { criarUsuarioSucesso, obterToken, criarProduto } from "../../support/utils"

describe("POST /produtos", () => {
    let token 
    let userId
    let email 

    before(() => {
        // criar um usuário que não tenha autorização para criar registros 
        criarUsuarioSucesso("false").then((user) => {
            email = user.email;
            userId = user.userId;
            return obterToken(email); 
        }).then((t) => {
            token = t;
        });
    });

    it("Tentar cadastrar um produto não sendo admin", () => {
        criarProduto(token, 100).then((response) => {
            expect(response.status).to.eq(403);
            expect(response.body.message).to.eq('Rota exclusiva para administradores');
        });
    });

    after(() => {
        if (userId) {
            cy.request({
                method: "DELETE", 
                url: `${Cypress.env("API_URL")}/usuarios/${userId}`
            });
        }
    });
})