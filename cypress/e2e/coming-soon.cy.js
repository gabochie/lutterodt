describe('Coming Soon Page', () => {
  it('should load the coming soon page', () => {
    cy.visit('/');
    cy.contains('The Lutterodt').should('be.visible');
    cy.contains('Renaissance').should('be.visible');
  });

  it('should display lead capture form', () => {
    cy.visit('/');
    cy.get('input[type="email"]').should('be.visible');
    cy.get('button').contains('Notify Me').should('be.visible');
  });

  it('should show admin link', () => {
    cy.visit('/');
    cy.contains('Admin').should('be.visible');
  });
});