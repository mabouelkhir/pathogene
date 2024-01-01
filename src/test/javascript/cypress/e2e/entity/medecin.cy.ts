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

describe('Medecin e2e test', () => {
  const medecinPageUrl = '/medecin';
  const medecinPageUrlPattern = new RegExp('/medecin(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const medecinSample = {};

  let medecin;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/medecins+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/medecins').as('postEntityRequest');
    cy.intercept('DELETE', '/api/medecins/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (medecin) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/medecins/${medecin.id}`,
      }).then(() => {
        medecin = undefined;
      });
    }
  });

  it('Medecins menu should load Medecins page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('medecin');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Medecin').should('exist');
    cy.url().should('match', medecinPageUrlPattern);
  });

  describe('Medecin page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(medecinPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Medecin page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/medecin/new$'));
        cy.getEntityCreateUpdateHeading('Medecin');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', medecinPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/medecins',
          body: medecinSample,
        }).then(({ body }) => {
          medecin = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/medecins+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/medecins?page=0&size=20>; rel="last",<http://localhost/api/medecins?page=0&size=20>; rel="first"',
              },
              body: [medecin],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(medecinPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Medecin page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('medecin');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', medecinPageUrlPattern);
      });

      it('edit button click should load edit Medecin page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Medecin');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', medecinPageUrlPattern);
      });

      it('edit button click should load edit Medecin page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Medecin');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', medecinPageUrlPattern);
      });

      it('last delete button click should delete instance of Medecin', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('medecin').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', medecinPageUrlPattern);

        medecin = undefined;
      });
    });
  });

  describe('new Medecin page', () => {
    beforeEach(() => {
      cy.visit(`${medecinPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Medecin');
    });

    it('should create an instance of Medecin', () => {
      cy.get(`[data-cy="code"]`).type('Rustic').should('have.value', 'Rustic');

      cy.get(`[data-cy="nom"]`).type('France Pennsylvania').should('have.value', 'France Pennsylvania');

      cy.get(`[data-cy="numEmp"]`).type('synthesize JSON').should('have.value', 'synthesize JSON');

      cy.get(`[data-cy="prenom"]`).type('incubate Adaptive').should('have.value', 'incubate Adaptive');

      cy.get(`[data-cy="expertLevel"]`).type('98240').should('have.value', '98240');

      cy.setFieldImageAsBytesOfEntity('photo', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="type"]`).type('microchip Bedfordshire orchestration').should('have.value', 'microchip Bedfordshire orchestration');

      cy.get(`[data-cy="nbrPatients"]`).type('7641').should('have.value', '7641');

      cy.get(`[data-cy="rating"]`).type('93394').should('have.value', '93394');

      cy.get(`[data-cy="description"]`)
        .type('../fake-data/blob/hipster.txt')
        .invoke('val')
        .should('match', new RegExp('../fake-data/blob/hipster.txt'));

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        medecin = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', medecinPageUrlPattern);
    });
  });
});
