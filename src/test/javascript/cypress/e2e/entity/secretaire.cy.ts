import {
  entityTableSelector,
  entityDetailsButtonSelector,
  entityDetailsBackButtonSelector,
  entityCreateButtonSelector,
  entityCreateSaveButtonSelector,
  entityCreateCancelButtonSelector,
  entityEditButtonSelector,
  entityDeleteButtonSelector,
  entityConfirmDeleteButtonSelector,
} from '../../support/entity';

describe('Secretaire e2e test', () => {
  const secretairePageUrl = '/secretaire';
  const secretairePageUrlPattern = new RegExp('/secretaire(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const secretaireSample = {};

  let secretaire;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/secretaires+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/secretaires').as('postEntityRequest');
    cy.intercept('DELETE', '/api/secretaires/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (secretaire) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/secretaires/${secretaire.id}`,
      }).then(() => {
        secretaire = undefined;
      });
    }
  });

  it('Secretaires menu should load Secretaires page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('secretaire');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Secretaire').should('exist');
    cy.url().should('match', secretairePageUrlPattern);
  });

  describe('Secretaire page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(secretairePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Secretaire page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/secretaire/new$'));
        cy.getEntityCreateUpdateHeading('Secretaire');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', secretairePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/secretaires',
          body: secretaireSample,
        }).then(({ body }) => {
          secretaire = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/secretaires+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/secretaires?page=0&size=20>; rel="last",<http://localhost/api/secretaires?page=0&size=20>; rel="first"',
              },
              body: [secretaire],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(secretairePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Secretaire page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('secretaire');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', secretairePageUrlPattern);
      });

      it('edit button click should load edit Secretaire page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Secretaire');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', secretairePageUrlPattern);
      });

      it('edit button click should load edit Secretaire page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Secretaire');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', secretairePageUrlPattern);
      });

      it('last delete button click should delete instance of Secretaire', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('secretaire').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', secretairePageUrlPattern);

        secretaire = undefined;
      });
    });
  });

  describe('new Secretaire page', () => {
    beforeEach(() => {
      cy.visit(`${secretairePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Secretaire');
    });

    it('should create an instance of Secretaire', () => {
      cy.get(`[data-cy="code"]`).type('Steel connecting Ridge').should('have.value', 'Steel connecting Ridge');

      cy.get(`[data-cy="nom"]`).type('1080p').should('have.value', '1080p');

      cy.get(`[data-cy="numEmp"]`).type('Wooden Grocery Buckinghamshire').should('have.value', 'Wooden Grocery Buckinghamshire');

      cy.get(`[data-cy="prenom"]`).type('Dakota').should('have.value', 'Dakota');

      cy.get(`[data-cy="admin"]`).should('not.be.checked');
      cy.get(`[data-cy="admin"]`).click().should('be.checked');

      cy.setFieldImageAsBytesOfEntity('photo', 'integration-test.png', 'image/png');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        secretaire = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', secretairePageUrlPattern);
    });
  });
});
