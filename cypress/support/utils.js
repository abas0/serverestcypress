// para funções comumente usadas no código

function criarUsuario(admin = "true"){
    const email = `user${Date.now()}@qa.com.br`;
    return cy.createUser(email, admin).then((response) => {
        expect(response.status).to.eq(201);
        return { email, userId: response.body._id };
    });
}

function obterToken(email) {
    return cy.getToken(email).then((token) => token);
}

function criarProduto(token, nome, quantidade) {
    return cy.request({
        method: "POST",
        url: `${Cypress.env("API_URL")}/produtos`,
        headers: { authorization: token },
        body: {
            nome,
            preco: 470,
            descricao: "Teste",
            quantidade
        }
    }).then((response) => {
        expect(response.status).to.eq(201);
        return response.body._id;
    });
}

export { criarUsuario, obterToken, criarProduto};