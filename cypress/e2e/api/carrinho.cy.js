// Fluxo completo de uma compra e analisar a quantidade do produto diminuindo

describe("POST /carrinhos", () => {
    let token 
    let userId
    let productId
    // let carrinhoId
    const email = `taylor${Date.now()}@qa.com.br`
    const nome = `PlayStation ${Date.now()}`
    const quantidadeTotal = 100
    const quantidadeComprada = 1

    before(() => {
        // criar um usuário que tenha autorização para criar registros 
        cy.createUser(email, "true").then((response) => {
            expect(response.status).to.eq(201)
            userId = response.body._id
            cy.getToken(email).then((t) => {
                token = t
            })
        })
    })

    it("Fluxo completo de uma compra e analisar a quantidade do produto diminuindo", () => {
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
                quantidade: quantidadeTotal
            }
        }).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
            productId = response.body._id

            cy.request({
                method: "POST",
                url: `${Cypress.env("API_URL")}/carrinhos`,
                headers:{
                    authorization: token
                },
                body:{
                    produtos: [
                        {
                            idProduto: productId,
                            quantidade: quantidadeComprada
                        }
                    ]
                }
            })
            .then((response) => {
                expect(response.status).to.eq(201);
                expect(response.body.message).to.eq("Cadastro realizado com sucesso")
                cy.request({
                    method: "DELETE",
                    url: `${Cypress.env("API_URL")}/carrinhos/concluir-compra`,
                    headers:{
                        authorization: token
                    },
                })
                .then((response) => {
                    expect(response.status).to.eq(200)
                    expect(response.body.message).to.eq("Registro excluído com sucesso")
                    cy.request({
                        method: "GET",
                        url: `${Cypress.env("API_URL")}/produtos/${productId}`,
                        headers: {
                            authorization: token
                        }
                    }).then((response) => {
                        expect(response.body.quantidade).to.eq(quantidadeTotal-quantidadeComprada)
                    })
                })
            })
        })

    })

    after(() => {
        if (productId){
            cy.request({
                method: "DELETE",
                url: `${Cypress.env("API_URL")}/produtos/${productId}`,
                headers: {
                    authorization: token
                }
            })
        }
        if (userId) {
            cy.request({
                method: "DELETE", 
                url: `${Cypress.env("API_URL")}/usuarios/${userId}`
            })
        }
    })
})