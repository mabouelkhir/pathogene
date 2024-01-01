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

describe('Unclassified e2e test', () => {
  const unclassifiedPageUrl = '/unclassified';
  const unclassifiedPageUrlPattern = new RegExp('/unclassified(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const unclassifiedSample = {};

  let unclassified;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/unclassifieds+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/unclassifieds').as('postEntityRequest');
    cy.intercept('DELETE', '/api/unclassifieds/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (unclassified) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/unclassifieds/${unclassified.id}`,
      }).then(() => {
        unclassified = undefined;
      });
    }
  });

  it('Unclassifieds menu should load Unclassifieds page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('unclassified');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Unclassified').should('exist');
    cy.url().should('match', unclassifiedPageUrlPattern);
  });

  describe('Unclassified page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(unclassifiedPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Unclassified page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/unclassified/new$'));
        cy.getEntityCreateUpdateHeading('Unclassified');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', unclassifiedPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/unclassifieds',
          body: unclassifiedSample,
        }).then(({ body }) => {
          unclassified = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/unclassifieds+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/unclassifieds?page=0&size=20>; rel="last",<http://localhost/api/unclassifieds?page=0&size=20>; rel="first"',
              },
              body: [unclassified],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(unclassifiedPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Unclassified page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('unclassified');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', unclassifiedPageUrlPattern);
      });

      it('edit button click should load edit Unclassified page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Unclassified');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', unclassifiedPageUrlPattern);
      });

      it('edit button click should load edit Unclassified page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Unclassified');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', unclassifiedPageUrlPattern);
      });

      it('last delete button click should delete instance of Unclassified', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('unclassified').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', unclassifiedPageUrlPattern);

        unclassified = undefined;
      });
    });
  });

  describe('new Unclassified page', () => {
    beforeEach(() => {
      cy.visit(`${unclassifiedPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Unclassified');
    });

    it('should create an instance of Unclassified', () => {
      cy.get(`[data-cy="code"]`).type('Handcrafted Toys Designer').should('have.value', 'Handcrafted Toys Designer');

      cy.setFieldImageAsBytesOfEntity('photo', 'integration-test.png', 'image/png');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        unclassified = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', unclassifiedPageUrlPattern);
    });
  });
});
