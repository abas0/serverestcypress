// Tentar cadastrar um produto não sendo admin

describe("POST /produtos", () => {
    let token 
    let userId
    const email = `taylor${Date.now()}@qa.com.br`
    const nome = `PlayStation ${Date.now()}`

    before(() => {
        // criar um usuário que não tenha autorização para criar registros 
        cy.createUser(email, "false").then((response) => {
            expect(response.status).to.eq(201)
            userId = response.body._id
            cy.getToken(email).then((t) => {
                token = t
            })
        })
    })

    after(() => {
        if (userId) {
            cy.request({
                method: "DELETE", 
                url: `${Cypress.env("API_URL")}/usuarios/${userId}`
            })
        }
    })


    it("Tentar cadastrar um produto não sendo admin", () => {
        cy.request({
            method: "POST", 
            url: `${Cypress.env("API_URL")}/produtos`,
            headers:{
                authorization: token
            },
            body: {
                nome: nome,
                preco: 470,
                descricao: "Teste",
                quantidade: 100
            },
            failOnStatusCode: false
        }).then((response) => {
            expect(response.status).to.eq(403)
            expect(response.body.message).to.eq('Rota exclusiva para administradores')
        })
    })
})