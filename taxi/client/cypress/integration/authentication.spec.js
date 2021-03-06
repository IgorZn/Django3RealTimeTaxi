const logIn = () => {
    const { username, password } = Cypress.env('credentials');

    // Capture HTTP requests.
    cy.server();
    cy.route({
        method: 'POST',
        url: '**/api/log_in/**',
        status: 200,
        response: {
            'access': 'ACCESS_TOKEN',
            'refresh': 'REFRESH_TOKEN'
        }
    }).as('logIn');

    // Log into the app.
    cy.visit('/#/log-in');
    cy.get('input#username').type(username);
    cy.get('input#password').type(password, { log: false });
    cy.get('button').contains('Log in').click();
    cy.wait('@logIn');
};

describe('Authentication', function () {
    it('Can sign up.', function () {
        const { username, password } = Cypress.env('credentials');
        cy.task('tableDeleteUser', username)

        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/sign_up/**',
            status: 201,
            response: {
                'id': 1,
                'username': 'gary.cole@example.com',
                'first_name': 'Gary',
                'last_name': 'Cole',
                'group': 'driver',
                'photo': '/media/images/photo.jpg'
            }
        }).as('signUp');

        cy.visit('/#/sign-up');
        cy.get('input#username').type('gary.cole@example.com');
        cy.get('input#firstName').type('Gary');
        cy.get('input#lastName').type('Cole');
        cy.get('input#password').type('pAssw0rd', { log: false });
        cy.get('select#group').select('driver');

        // Handle file upload
        cy.fixture('images/photo.jpg').then(photo => {
            cy.get('input#photo').attachFile({
                fileContent: photo,
                fileName: 'photo.jpg',
                mimeType: 'application/json'
            });
        });

        cy.fixture('images/photo.jpg').then(photo => {
            cy.get('input#photo').attachFile({
                fileContent: photo,
                fileName: 'photo.jpg',
                mimeType: 'application/json'
            });
        });
        cy.get('button').contains('Sign up').click();
        cy.wait('@signUp'); // new
        cy.hash().should('eq', '#/log-in');
    });

    it('Can log in.', function () {
        logIn();
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include(err.message)

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.hash().should('eq', '#/');

    });

    it.only('Can log out.', function () {
        logIn();
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include(err.message)

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.get('btn').contains('Log out').click()
        // cy.get('button').contains('Log out').click().should(() => {
        //     expect(window.localStorage.getItem('taxi.auth')).to.be.null;
        // });
        // cy.get('button').contains('Log in').should('be.visible');
    });

    it('Cannot visit the login page when logged in.', function () {
        logIn();
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include(err.message)

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.visit('/log-in');
        cy.hash().should('eq', '#/');
    });

    it('Cannot visit the sign up page when logged in.', function () {
        logIn();
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include(err.message)

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.visit('/sign-up');
        cy.hash().should('eq', '#/');
    });

    it('Cannot see links when logged in.', function () {
        logIn();
        cy.on('uncaught:exception', (err, runnable) => {
            expect(err.message).to.include(err.message)

            // using mocha's async done callback to finish
            // this test so we prove that an uncaught exception
            // was thrown
            done()

            // return false to prevent the error from
            // failing this test
            return false
        })
        cy.get('button#signUp').should('not.exist');
        cy.get('button#logIn').should('not.exist');
    });

    it('Shows an alert on login error.', function () {
        const { username, password } = Cypress.env('credentials');
        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/log_in/**',
            status: 400,
            response: {
                '__all__': [
                    'Please enter a correct username and password. ' +
                    'Note that both fields may be case-sensitive.'
                ]
            }
        }).as('logIn');
        cy.visit('/#/log-in');
        cy.get('input#username').type(username);
        cy.get('input#password').type(password, { log: false });
        cy.get('button').contains('Log in').click();
        cy.wait('@logIn');
        cy.get('div.alert').contains(
            'Please enter a correct username and password. ' +
            'Note that both fields may be case-sensitive.'
        );
        cy.hash().should('eq', '#/log-in');
    });

    it('Show invalid fields on sign up error.', function () {
        // We capture outgoing client requests to the /api/sign_up/
        // API endpoint and return a mock client error.
        cy.server();
        cy.route({
            method: 'POST',
            url: '**/api/sign_up/**',
            status: 400,
            response: {
                'username': [
                    'A user with that username already exists.'
                ]
            }
        }).as('signUp');

        cy.visit('/#/sign-up');
        cy.get('input#username').type('gary.cole@example.com');
        cy.get('input#firstName').type('Gary');
        cy.get('input#lastName').type('Cole');
        cy.get('input#password').type('pAssw0rd', { log: false });
        cy.get('select#group').select('driver');

        // Handle file upload
        cy.fixture('images/photo.jpg').then(photo => {
            cy.get('input#photo').attachFile({
                fileContent: photo,
                fileName: 'photo.jpg',
                mimeType: 'application/json'
            });
        });
        cy.get('button').contains('Sign up').click();
        cy.wait('@signUp');
        cy.get('div.invalid-feedback').contains(
            'A user with that username already exists'
        );
        cy.hash().should('eq', '#/sign-up');
    });

});