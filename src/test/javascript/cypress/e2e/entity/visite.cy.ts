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

describe('Visite e2e test', () => {
  const visitePageUrl = '/visite';
  const visitePageUrlPattern = new RegExp('/visite(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const visiteSample = {};

  let visite;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/visites+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/visites').as('postEntityRequest');
    cy.intercept('DELETE', '/api/visites/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (visite) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/visites/${visite.id}`,
      }).then(() => {
        visite = undefined;
      });
    }
  });

  it('Visites menu should load Visites page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('visite');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Visite').should('exist');
    cy.url().should('match', visitePageUrlPattern);
  });

  describe('Visite page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(visitePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Visite page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/visite/new$'));
        cy.getEntityCreateUpdateHeading('Visite');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/visites',
          body: visiteSample,
        }).then(({ body }) => {
          visite = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/visites+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/visites?page=0&size=20>; rel="last",<http://localhost/api/visites?page=0&size=20>; rel="first"',
              },
              body: [visite],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(visitePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Visite page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('visite');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitePageUrlPattern);
      });

      it('edit button click should load edit Visite page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Visite');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitePageUrlPattern);
      });

      it('edit button click should load edit Visite page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Visite');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitePageUrlPattern);
      });

      it('last delete button click should delete instance of Visite', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('visite').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', visitePageUrlPattern);

        visite = undefined;
      });
    });
  });

  describe('new Visite page', () => {
    beforeEach(() => {
      cy.visit(`${visitePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Visite');
    });

    it('should create an instance of Visite', () => {
      cy.get(`[data-cy="code"]`).type('Dakota Team-oriented SMTP').should('have.value', 'Dakota Team-oriented SMTP');

      cy.get(`[data-cy="date"]`).type('2023-10-24T13:15').blur().should('have.value', '2023-10-24T13:15');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        visite = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', visitePageUrlPattern);
    });
  });
});
