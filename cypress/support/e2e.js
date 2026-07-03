Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      cy.setCookie('pb_auth', response.body.token);
    }
  });
});

Cypress.Commands.add('logout', () => {
  cy.request({
    method: 'POST',
    url: '/api/logout',
    failOnStatusCode: false,
  });
  cy.clearCookie('pb_auth');
});