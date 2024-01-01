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

describe('RendezVous e2e test', () => {
  const rendezVousPageUrl = '/rendez-vous';
  const rendezVousPageUrlPattern = new RegExp('/rendez-vous(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const rendezVousSample = {};

  let rendezVous;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/rendez-vous+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/rendez-vous').as('postEntityRequest');
    cy.intercept('DELETE', '/api/rendez-vous/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (rendezVous) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/rendez-vous/${rendezVous.id}`,
      }).then(() => {
        rendezVous = undefined;
      });
    }
  });

  it('RendezVous menu should load RendezVous page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('rendez-vous');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('RendezVous').should('exist');
    cy.url().should('match', rendezVousPageUrlPattern);
  });

  describe('RendezVous page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(rendezVousPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create RendezVous page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/rendez-vous/new$'));
        cy.getEntityCreateUpdateHeading('RendezVous');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rendezVousPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/rendez-vous',
          body: rendezVousSample,
        }).then(({ body }) => {
          rendezVous = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/rendez-vous+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/rendez-vous?page=0&size=20>; rel="last",<http://localhost/api/rendez-vous?page=0&size=20>; rel="first"',
              },
              body: [rendezVous],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(rendezVousPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details RendezVous page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('rendezVous');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rendezVousPageUrlPattern);
      });

      it('edit button click should load edit RendezVous page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RendezVous');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rendezVousPageUrlPattern);
      });

      it('edit button click should load edit RendezVous page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('RendezVous');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rendezVousPageUrlPattern);
      });

      it('last delete button click should delete instance of RendezVous', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('rendezVous').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', rendezVousPageUrlPattern);

        rendezVous = undefined;
      });
    });
  });

  describe('new RendezVous page', () => {
    beforeEach(() => {
      cy.visit(`${rendezVousPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('RendezVous');
    });

    it('should create an instance of RendezVous', () => {
      cy.get(`[data-cy="date"]`).type('2023-10-24T06:29').blur().should('have.value', '2023-10-24T06:29');

      cy.get(`[data-cy="code"]`).type('stable synthesize').should('have.value', 'stable synthesize');

      cy.get(`[data-cy="status"]`).type('Universal').should('have.value', 'Universal');

      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        rendezVous = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', rendezVousPageUrlPattern);
    });
  });
});
