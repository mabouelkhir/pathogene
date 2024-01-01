package emsi.iir4.pathogene.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import emsi.iir4.pathogene.IntegrationTest;
import emsi.iir4.pathogene.domain.Classification;
import emsi.iir4.pathogene.repository.ClassificationRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ClassificationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClassificationResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final Boolean DEFAULT_SCORE = false;
    private static final Boolean UPDATED_SCORE = true;

    private static final String ENTITY_API_URL = "/api/classifications";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ClassificationRepository classificationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClassificationMockMvc;

    private Classification classification;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classification createEntity(EntityManager em) {
        Classification classification = new Classification().code(DEFAULT_CODE).score(DEFAULT_SCORE);
        return classification;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classification createUpdatedEntity(EntityManager em) {
        Classification classification = new Classification().code(UPDATED_CODE).score(UPDATED_SCORE);
        return classification;
    }

    @BeforeEach
    public void initTest() {
        classification = createEntity(em);
    }

    @Test
    @Transactional
    void createClassification() throws Exception {
        int databaseSizeBeforeCreate = classificationRepository.findAll().size();
        // Create the Classification
        restClassificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isCreated());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeCreate + 1);
        Classification testClassification = classificationList.get(classificationList.size() - 1);
        assertThat(testClassification.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testClassification.getScore()).isEqualTo(DEFAULT_SCORE);
    }

    @Test
    @Transactional
    void createClassificationWithExistingId() throws Exception {
        // Create the Classification with an existing ID
        classification.setId(1L);

        int databaseSizeBeforeCreate = classificationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClassificationMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClassifications() throws Exception {
        // Initialize the database
        classificationRepository.saveAndFlush(classification);

        // Get all the classificationList
        restClassificationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classification.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].score").value(hasItem(DEFAULT_SCORE.booleanValue())));
    }

    @Test
    @Transactional
    void getClassification() throws Exception {
        // Initialize the database
        classificationRepository.saveAndFlush(classification);

        // Get the classification
        restClassificationMockMvc
            .perform(get(ENTITY_API_URL_ID, classification.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(classification.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.score").value(DEFAULT_SCORE.booleanValue()));
    }

    @Test
    @Transactional
    void getNonExistingClassification() throws Exception {
        // Get the classification
        restClassificationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClassification() throws Exception {
        // Initialize the database
        classificationRepository.saveAndFlush(classification);

        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();

        // Update the classification
        Classification updatedClassification = classificationRepository.findById(classification.getId()).get();
        // Disconnect from session so that the updates on updatedClassification are not directly saved in db
        em.detach(updatedClassification);
        updatedClassification.code(UPDATED_CODE).score(UPDATED_SCORE);

        restClassificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClassification.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedClassification))
            )
            .andExpect(status().isOk());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
        Classification testClassification = classificationList.get(classificationList.size() - 1);
        assertThat(testClassification.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testClassification.getScore()).isEqualTo(UPDATED_SCORE);
    }

    @Test
    @Transactional
    void putNonExistingClassification() throws Exception {
        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();
        classification.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, classification.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClassification() throws Exception {
        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();
        classification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassificationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClassification() throws Exception {
        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();
        classification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassificationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(classification)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClassificationWithPatch() throws Exception {
        // Initialize the database
        classificationRepository.saveAndFlush(classification);

        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();

        // Update the classification using partial update
        Classification partialUpdatedClassification = new Classification();
        partialUpdatedClassification.setId(classification.getId());

        restClassificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassification))
            )
            .andExpect(status().isOk());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
        Classification testClassification = classificationList.get(classificationList.size() - 1);
        assertThat(testClassification.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testClassification.getScore()).isEqualTo(DEFAULT_SCORE);
    }

    @Test
    @Transactional
    void fullUpdateClassificationWithPatch() throws Exception {
        // Initialize the database
        classificationRepository.saveAndFlush(classification);

        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();

        // Update the classification using partial update
        Classification partialUpdatedClassification = new Classification();
        partialUpdatedClassification.setId(classification.getId());

        partialUpdatedClassification.code(UPDATED_CODE).score(UPDATED_SCORE);

        restClassificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClassification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedClassification))
            )
            .andExpect(status().isOk());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
        Classification testClassification = classificationList.get(classificationList.size() - 1);
        assertThat(testClassification.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testClassification.getScore()).isEqualTo(UPDATED_SCORE);
    }

    @Test
    @Transactional
    void patchNonExistingClassification() throws Exception {
        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();
        classification.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClassificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, classification.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClassification() throws Exception {
        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();
        classification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassificationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClassification() throws Exception {
        int databaseSizeBeforeUpdate = classificationRepository.findAll().size();
        classification.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClassificationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(classification))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Classification in the database
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClassification() throws Exception {
        // Initialize the database
        classificationRepository.saveAndFlush(classification);

        int databaseSizeBeforeDelete = classificationRepository.findAll().size();

        // Delete the classification
        restClassificationMockMvc
            .perform(delete(ENTITY_API_URL_ID, classification.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Classification> classificationList = classificationRepository.findAll();
        assertThat(classificationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
