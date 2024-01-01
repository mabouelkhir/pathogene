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

describe('Stade e2e test', () => {
  const stadePageUrl = '/stade';
  const stadePageUrlPattern = new RegExp('/stade(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const stadeSample = {};

  let stade;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/stades+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/stades').as('postEntityRequest');
    cy.intercept('DELETE', '/api/stades/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (stade) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/stades/${stade.id}`,
      }).then(() => {
        stade = undefined;
      });
    }
  });

  it('Stades menu should load Stades page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('stade');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Stade').should('exist');
    cy.url().should('match', stadePageUrlPattern);
  });

  describe('Stade page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(stadePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Stade page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/stade/new$'));
        cy.getEntityCreateUpdateHeading('Stade');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stadePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/stades',
          body: stadeSample,
        }).then(({ body }) => {
          stade = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/stades+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/stades?page=0&size=20>; rel="last",<http://localhost/api/stades?page=0&size=20>; rel="first"',
              },
              body: [stade],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(stadePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Stade page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('stade');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stadePageUrlPattern);
      });

      it('edit button click should load edit Stade page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Stade');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stadePageUrlPattern);
      });

      it('edit button click should load edit Stade page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Stade');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stadePageUrlPattern);
      });

      it('last delete button click should delete instance of Stade', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('stade').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', stadePageUrlPattern);

        stade = undefined;
      });
    });
  });

  describe('new Stade page', () => {
    beforeEach(() => {
      cy.visit(`${stadePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Stade');
    });

    it('should create an instance of Stade', () => {
      cy.get(`[data-cy="code"]`).type('Czech Account transmitting').should('have.value', 'Czech Account transmitting');

      cy.get(`[data-cy="level"]`).type('transmit').should('have.value', 'transmit');

      cy.get(`[data-cy="description"]`).type('AGP').should('have.value', 'AGP');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        stade = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', stadePageUrlPattern);
    });
  });
});
