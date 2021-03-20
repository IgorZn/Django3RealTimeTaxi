const logIn = () => {
    const { username, password } = Cypress.env('driver');
    cy.server();
    cy.route('POST', '**/api/log_in/').as('logIn');
    cy.visit('/#/log-in');
    cy.get('input#username').type(username);
    cy.get('input#password').type(password, { log: false });
    cy.get('button').contains('Log in').click();
    cy.wait('@logIn');
};

describe('The driver dashboard', function () {
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

    it('Cannot be visited if the user is not a driver', function () {
        const { username, password } = Cypress.env('rider')

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

        cy.visit('/#/driver')
        cy.hash().should('eq', '#/')
    });

    it('Can be visited if the user is a driver', function () {
        const { username, password } = Cypress.env('driver')

        logIn()
        cy.visit('/#/driver')
        cy.hash().should('eq', '#/driver')
    });

    it('Displays messages for no trips', function () {
        cy.server();
        cy.route('GET', '**/api/trip/').as('getTrips');

        logIn();

        cy.visit('/#/driver');
        cy.wait('@getTrips');

        // Current trips.
        cy.get('[data-cy=trip-card]')
            .eq(0)
            .contains('No trips.');

        // Requested trips.
        cy.get('[data-cy=trip-card]')
            .eq(1)
            .contains('No trips.');

        // Completed trips.
        cy.get('[data-cy=trip-card]')
            .eq(2)
            .contains('No trips.');
    });
})