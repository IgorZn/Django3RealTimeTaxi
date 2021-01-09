describe('Navigation', function () {
    it('Can navigate to sign up from home', function () {
        cy.visit('/#/');
        cy.get('a').contains('Sign up').click();
        cy.hash().should('eq', '#/sign-up');
    });
});