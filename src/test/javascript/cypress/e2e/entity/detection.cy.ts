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

describe('Detection e2e test', () => {
  const detectionPageUrl = '/detection';
  const detectionPageUrlPattern = new RegExp('/detection(\\?.*)?$');
  const username = Cypress.env('E2E_USERNAME') ?? 'user';
  const password = Cypress.env('E2E_PASSWORD') ?? 'user';
  const detectionSample = {};

  let detection;

  beforeEach(() => {
    cy.login(username, password);
  });

  beforeEach(() => {
    cy.intercept('GET', '/api/detections+(?*|)').as('entitiesRequest');
    cy.intercept('POST', '/api/detections').as('postEntityRequest');
    cy.intercept('DELETE', '/api/detections/*').as('deleteEntityRequest');
  });

  afterEach(() => {
    if (detection) {
      cy.authenticatedRequest({
        method: 'DELETE',
        url: `/api/detections/${detection.id}`,
      }).then(() => {
        detection = undefined;
      });
    }
  });

  it('Detections menu should load Detections page', () => {
    cy.visit('/');
    cy.clickOnEntityMenuItem('detection');
    cy.wait('@entitiesRequest').then(({ response }) => {
      if (response.body.length === 0) {
        cy.get(entityTableSelector).should('not.exist');
      } else {
        cy.get(entityTableSelector).should('exist');
      }
    });
    cy.getEntityHeading('Detection').should('exist');
    cy.url().should('match', detectionPageUrlPattern);
  });

  describe('Detection page', () => {
    describe('create button click', () => {
      beforeEach(() => {
        cy.visit(detectionPageUrl);
        cy.wait('@entitiesRequest');
      });

      it('should load create Detection page', () => {
        cy.get(entityCreateButtonSelector).click();
        cy.url().should('match', new RegExp('/detection/new$'));
        cy.getEntityCreateUpdateHeading('Detection');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detectionPageUrlPattern);
      });
    });

    describe('with existing value', () => {
      beforeEach(() => {
        cy.authenticatedRequest({
          method: 'POST',
          url: '/api/detections',
          body: detectionSample,
        }).then(({ body }) => {
          detection = body;

          cy.intercept(
            {
              method: 'GET',
              url: '/api/detections+(?*|)',
              times: 1,
            },
            {
              statusCode: 200,
              headers: {
                link: '<http://localhost/api/detections?page=0&size=20>; rel="last",<http://localhost/api/detections?page=0&size=20>; rel="first"',
              },
              body: [detection],
            }
          ).as('entitiesRequestInternal');
        });

        cy.visit(detectionPageUrl);

        cy.wait('@entitiesRequestInternal');
      });

      it('detail button click should load details Detection page', () => {
        cy.get(entityDetailsButtonSelector).first().click();
        cy.getEntityDetailsHeading('detection');
        cy.get(entityDetailsBackButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detectionPageUrlPattern);
      });

      it('edit button click should load edit Detection page and go back', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Detection');
        cy.get(entityCreateSaveButtonSelector).should('exist');
        cy.get(entityCreateCancelButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detectionPageUrlPattern);
      });

      it('edit button click should load edit Detection page and save', () => {
        cy.get(entityEditButtonSelector).first().click();
        cy.getEntityCreateUpdateHeading('Detection');
        cy.get(entityCreateSaveButtonSelector).click();
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detectionPageUrlPattern);
      });

      it('last delete button click should delete instance of Detection', () => {
        cy.get(entityDeleteButtonSelector).last().click();
        cy.getEntityDeleteDialogHeading('detection').should('exist');
        cy.get(entityConfirmDeleteButtonSelector).click();
        cy.wait('@deleteEntityRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(204);
        });
        cy.wait('@entitiesRequest').then(({ response }) => {
          expect(response.statusCode).to.equal(200);
        });
        cy.url().should('match', detectionPageUrlPattern);

        detection = undefined;
      });
    });
  });

  describe('new Detection page', () => {
    beforeEach(() => {
      cy.visit(`${detectionPageUrl}`);
      cy.get(entityCreateButtonSelector).click();
      cy.getEntityCreateUpdateHeading('Detection');
    });

    it('should create an instance of Detection', () => {
      cy.setFieldImageAsBytesOfEntity('photo', 'integration-test.png', 'image/png');

      cy.get(`[data-cy="code"]`).type('Islands Specialist deliverables').should('have.value', 'Islands Specialist deliverables');

      cy.get(`[data-cy="validation"]`).should('not.be.checked');
      cy.get(`[data-cy="validation"]`).click().should('be.checked');

      cy.get(`[data-cy="stade"]`).type('capacity Avon').should('have.value', 'capacity Avon');

      cy.get(`[data-cy="date"]`).type('2023-10-24T16:45').blur().should('have.value', '2023-10-24T16:45');

      cy.get(`[data-cy="description"]`).type('dynamic calculating back-end').should('have.value', 'dynamic calculating back-end');

      // since cypress clicks submit too fast before the blob fields are validated
      cy.wait(200); // eslint-disable-line cypress/no-unnecessary-waiting
      cy.get(entityCreateSaveButtonSelector).click();

      cy.wait('@postEntityRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(201);
        detection = response.body;
      });
      cy.wait('@entitiesRequest').then(({ response }) => {
        expect(response.statusCode).to.equal(200);
      });
      cy.url().should('match', detectionPageUrlPattern);
    });
  });
});
