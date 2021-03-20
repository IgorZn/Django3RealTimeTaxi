const logIn = () => {
    const { username, password } = Cypress.env('rider');
    cy.server();
    cy.route('POST', '**/api/log_in/').as('logIn');
    cy.visit('/#/log-in');
    cy.get('input#username').type(username);
    cy.get('input#password').type(password, { log: false });
    cy.get('button').contains('Log in').click();
    cy.wait('@logIn');
};

describe('The rider dashboard', function () {

    before(function () {
        cy.fixture('data/users.json').then((users) => {
            cy.task('tableInsert', {
                table: 'trips_user', rows: users, truncate: true
            })
        });
        cy.fixture('data/groups.json').then((groups) => {
            cy.task('tableInsert', {
                table: 'auth_group', rows: groups, truncate: true
            })
        });
        cy.fixture('data/user_groups.json').then((groups) => {
            cy.task('tableInsert', {
                table: 'trips_user_groups', rows: groups, truncate: true
            })
        });
    })

    it('Cannot be visited if the user is not a rider', function () {
        const { username, password } = Cypress.env('driver')

        // Capture API calls.
        cy.server()
        cy.route('POST', '**/api/log_in/').as('logIn')

        // Log in.
        cy.visit('/#/log-in')
        cy.get('input#username').type(username)
        cy.get('input#password').type(password, { log: false })
        cy.get('button').contains('Log in').click()
        cy.hash().should('eq', '#/')
        cy.get('button').contains('Log out')
        cy.wait('@logIn')

        cy.visit('/#/rider')
        cy.hash().should('eq', '#/')
    });

    it('Can be visited if the user is a rider', function () {
        const { username, password } = Cypress.env('rider')

        logIn()
        cy.visit('/#/rider')
        cy.hash().should('eq', '#/rider')
    });

    it('Displays messages for no trips', function () {
        cy.server();
        cy.route('GET', '**/api/trip/').as('getTrips');

        logIn();

        cy.visit('/#/rider');
        cy.wait('@getTrips');

        // Current trips.
        cy.get('[data-cy=trip-card]')
            .eq(0)
            .contains('No trips.');

        // Completed trips.
        cy.get('[data-cy=trip-card]')
            .eq(1)
            .contains('No trips.');
    });

})