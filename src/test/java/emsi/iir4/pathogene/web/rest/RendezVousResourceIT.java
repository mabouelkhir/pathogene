package emsi.iir4.pathogene.web.rest;

import static emsi.iir4.pathogene.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import emsi.iir4.pathogene.IntegrationTest;
import emsi.iir4.pathogene.domain.RendezVous;
import emsi.iir4.pathogene.repository.RendezVousRepository;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZoneOffset;
import java.time.ZonedDateTime;
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
 * Integration tests for the {@link RendezVousResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class RendezVousResourceIT {

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_STATUS = "AAAAAAAAAA";
    private static final String UPDATED_STATUS = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/rendez-vous";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private RendezVousRepository rendezVousRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restRendezVousMockMvc;

    private RendezVous rendezVous;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createEntity(EntityManager em) {
        RendezVous rendezVous = new RendezVous().date(DEFAULT_DATE).code(DEFAULT_CODE).status(DEFAULT_STATUS);
        return rendezVous;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static RendezVous createUpdatedEntity(EntityManager em) {
        RendezVous rendezVous = new RendezVous().date(UPDATED_DATE).code(UPDATED_CODE).status(UPDATED_STATUS);
        return rendezVous;
    }

    @BeforeEach
    public void initTest() {
        rendezVous = createEntity(em);
    }

    @Test
    @Transactional
    void createRendezVous() throws Exception {
        int databaseSizeBeforeCreate = rendezVousRepository.findAll().size();
        // Create the RendezVous
        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isCreated());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeCreate + 1);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDate()).isEqualTo(DEFAULT_DATE);
        assertThat(testRendezVous.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testRendezVous.getStatus()).isEqualTo(DEFAULT_STATUS);
    }

    @Test
    @Transactional
    void createRendezVousWithExistingId() throws Exception {
        // Create the RendezVous with an existing ID
        rendezVous.setId(1L);

        int databaseSizeBeforeCreate = rendezVousRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restRendezVousMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        // Get all the rendezVousList
        restRendezVousMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(rendezVous.getId().intValue())))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].status").value(hasItem(DEFAULT_STATUS)));
    }

    @Test
    @Transactional
    void getRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        // Get the rendezVous
        restRendezVousMockMvc
            .perform(get(ENTITY_API_URL_ID, rendezVous.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(rendezVous.getId().intValue()))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.status").value(DEFAULT_STATUS));
    }

    @Test
    @Transactional
    void getNonExistingRendezVous() throws Exception {
        // Get the rendezVous
        restRendezVousMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous
        RendezVous updatedRendezVous = rendezVousRepository.findById(rendezVous.getId()).get();
        // Disconnect from session so that the updates on updatedRendezVous are not directly saved in db
        em.detach(updatedRendezVous);
        updatedRendezVous.date(UPDATED_DATE).code(UPDATED_CODE).status(UPDATED_STATUS);

        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedRendezVous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRendezVous.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRendezVous.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void putNonExistingRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, rendezVous.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(rendezVous)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateRendezVousWithPatch() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous using partial update
        RendezVous partialUpdatedRendezVous = new RendezVous();
        partialUpdatedRendezVous.setId(rendezVous.getId());

        partialUpdatedRendezVous.date(UPDATED_DATE).code(UPDATED_CODE).status(UPDATED_STATUS);

        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRendezVous.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRendezVous.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void fullUpdateRendezVousWithPatch() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();

        // Update the rendezVous using partial update
        RendezVous partialUpdatedRendezVous = new RendezVous();
        partialUpdatedRendezVous.setId(rendezVous.getId());

        partialUpdatedRendezVous.date(UPDATED_DATE).code(UPDATED_CODE).status(UPDATED_STATUS);

        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedRendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedRendezVous))
            )
            .andExpect(status().isOk());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
        RendezVous testRendezVous = rendezVousList.get(rendezVousList.size() - 1);
        assertThat(testRendezVous.getDate()).isEqualTo(UPDATED_DATE);
        assertThat(testRendezVous.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testRendezVous.getStatus()).isEqualTo(UPDATED_STATUS);
    }

    @Test
    @Transactional
    void patchNonExistingRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, rendezVous.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isBadRequest());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamRendezVous() throws Exception {
        int databaseSizeBeforeUpdate = rendezVousRepository.findAll().size();
        rendezVous.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restRendezVousMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(rendezVous))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the RendezVous in the database
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteRendezVous() throws Exception {
        // Initialize the database
        rendezVousRepository.saveAndFlush(rendezVous);

        int databaseSizeBeforeDelete = rendezVousRepository.findAll().size();

        // Delete the rendezVous
        restRendezVousMockMvc
            .perform(delete(ENTITY_API_URL_ID, rendezVous.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<RendezVous> rendezVousList = rendezVousRepository.findAll();
        assertThat(rendezVousList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
