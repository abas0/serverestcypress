// Cadastrar um usuário com sucesso e pesquisá-lo na lista de usuários

describe("POST /usuarios", () => {
    const email = `taylor${Date.now()}@qa.com.br`
    let userId 

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
    it("Cadastrar um usuário com sucesso", () => {
        // cadastrando um usuário
        cy.request({
            method: "POST",
            url: `${Cypress.env("API_URL")}/usuarios`,
            body: 
            {
                nome: "Taylor Swift",
                email: email,
                password: "teste",
                administrador: "true"  
            }
        }).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.message).to.eq("Cadastro realizado com sucesso")
            userId = response.body._id

            // procurando o usuário recém cadastrado pelo id
            cy.request({
                method: "GET", 
                url: `${Cypress.env("API_URL")}/usuarios/${userId}`
            })
            .then((response) => {
                expect(response.status).to.eq(200)
                expect(response.body).to.have.property('nome', 'Taylor Swift')
                expect(response.body).to.have.property('email', email)
                expect(response.body).to.have.property('administrador', 'true')
            });
        });
    });
});