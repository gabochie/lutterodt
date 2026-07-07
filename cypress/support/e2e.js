Cypress.Commands.add('login', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/api/login',
    body: { email, password },
    failOnStatusCode: false,
  }).then((response) => {
    if (response.status === 200) {
      const cookies = response.headers['set-cookie'];
      if (cookies) {
        const match = cookies[0].match(/admin_token=([^;]+)/);
        if (match) {
          cy.setCookie('admin_token', match[1]);
        }
      }
    }
  });
});

Cypress.Commands.add('logout', () => {
  cy.clearCookie('admin_token');
});
