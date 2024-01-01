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

describe('Maladie e2e test', () => {
  const maladiePageUrl = '/maladie';
  const maladiePageUrlPattern = new RegExp('/maladie(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const maladieSample = {};

  let maladie;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/maladies+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/maladies').as('postEntityRequest');
    cy.intercept('DELETE', '/api/maladies/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (maladie) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/maladies/${maladie.id}`,
      }).then(() => {
        maladie = undefined;
      });
    }
  });

  it('Maladies menu should load Maladies page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('maladie');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Maladie').should('exist');
    cy.url().should('match', maladiePageUrlPattern);
  });

  describe('Maladie page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(maladiePageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Maladie page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/maladie/new$'));
        cy.getEntityCreateUpdateHeading('Maladie');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiePageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/maladies',
          body: maladieSample,
        }).then(({ body }) => {
          maladie = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/maladies+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/maladies?page=0&size=20>; rel="last",<http://localhost/api/maladies?page=0&size=20>; rel="first"',
              },
              body: [maladie],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(maladiePageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Maladie page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('maladie');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiePageUrlPattern);
      });

      it('edit button click should load edit Maladie page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Maladie');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiePageUrlPattern);
      });

      it('edit button click should load edit Maladie page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Maladie');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiePageUrlPattern);
      });

      it('last delete button click should delete instance of Maladie', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('maladie').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', maladiePageUrlPattern);

        maladie = undefined;
      });
    });
  });

  describe('new Maladie page', () => {
    beforeEach(() => {
      cy.visit(`${maladiePageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Maladie');
    });

    it('should create an instance of Maladie', () => {
      cy.get(`[data-cy="code"]`).type('Re-contextualized Metal').should('have.value', 'Re-contextualized Metal');

      cy.get(`[data-cy="nom"]`).type('wireless').should('have.value', 'wireless');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        maladie = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', maladiePageUrlPattern);
    });
  });
});
