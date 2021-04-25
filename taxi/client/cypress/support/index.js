import 'cypress-file-upload';

const loadTripData = () => {
    cy.fixture('data/trips.json').then((trips) => {
        cy.task('tableInsert', {
            table: 'trips_trip', rows: trips, truncate: true
        });
    });
};

Cypress.Commands.add('loadTripData', loadTripData);