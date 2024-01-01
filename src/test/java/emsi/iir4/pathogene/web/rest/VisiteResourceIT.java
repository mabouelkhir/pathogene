package emsi.iir4.pathogene.web.rest;

import static emsi.iir4.pathogene.web.rest.TestUtil.sameInstant;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import emsi.iir4.pathogene.IntegrationTest;
import emsi.iir4.pathogene.domain.Visite;
import emsi.iir4.pathogene.repository.VisiteRepository;
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
 * Integration tests for the {@link VisiteResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class VisiteResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final ZonedDateTime DEFAULT_DATE = ZonedDateTime.ofInstant(Instant.ofEpochMilli(0L), ZoneOffset.UTC);
    private static final ZonedDateTime UPDATED_DATE = ZonedDateTime.now(ZoneId.systemDefault()).withNano(0);

    private static final String ENTITY_API_URL = "/api/visites";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private VisiteRepository visiteRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restVisiteMockMvc;

    private Visite visite;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visite createEntity(EntityManager em) {
        Visite visite = new Visite().code(DEFAULT_CODE).date(DEFAULT_DATE);
        return visite;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Visite createUpdatedEntity(EntityManager em) {
        Visite visite = new Visite().code(UPDATED_CODE).date(UPDATED_DATE);
        return visite;
    }

    @BeforeEach
    public void initTest() {
        visite = createEntity(em);
    }

    @Test
    @Transactional
    void createVisite() throws Exception {
        int databaseSizeBeforeCreate = visiteRepository.findAll().size();
        // Create the Visite
        restVisiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visite)))
            .andExpect(status().isCreated());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeCreate + 1);
        Visite testVisite = visiteList.get(visiteList.size() - 1);
        assertThat(testVisite.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testVisite.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void createVisiteWithExistingId() throws Exception {
        // Create the Visite with an existing ID
        visite.setId(1L);

        int databaseSizeBeforeCreate = visiteRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restVisiteMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visite)))
            .andExpect(status().isBadRequest());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllVisites() throws Exception {
        // Initialize the database
        visiteRepository.saveAndFlush(visite);

        // Get all the visiteList
        restVisiteMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(visite.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].date").value(hasItem(sameInstant(DEFAULT_DATE))));
    }

    @Test
    @Transactional
    void getVisite() throws Exception {
        // Initialize the database
        visiteRepository.saveAndFlush(visite);

        // Get the visite
        restVisiteMockMvc
            .perform(get(ENTITY_API_URL_ID, visite.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(visite.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.date").value(sameInstant(DEFAULT_DATE)));
    }

    @Test
    @Transactional
    void getNonExistingVisite() throws Exception {
        // Get the visite
        restVisiteMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingVisite() throws Exception {
        // Initialize the database
        visiteRepository.saveAndFlush(visite);

        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();

        // Update the visite
        Visite updatedVisite = visiteRepository.findById(visite.getId()).get();
        // Disconnect from session so that the updates on updatedVisite are not directly saved in db
        em.detach(updatedVisite);
        updatedVisite.code(UPDATED_CODE).date(UPDATED_DATE);

        restVisiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedVisite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedVisite))
            )
            .andExpect(status().isOk());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
        Visite testVisite = visiteList.get(visiteList.size() - 1);
        assertThat(testVisite.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testVisite.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void putNonExistingVisite() throws Exception {
        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();
        visite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, visite.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchVisite() throws Exception {
        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();
        visite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisiteMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(visite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamVisite() throws Exception {
        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();
        visite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisiteMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(visite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateVisiteWithPatch() throws Exception {
        // Initialize the database
        visiteRepository.saveAndFlush(visite);

        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();

        // Update the visite using partial update
        Visite partialUpdatedVisite = new Visite();
        partialUpdatedVisite.setId(visite.getId());

        restVisiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisite))
            )
            .andExpect(status().isOk());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
        Visite testVisite = visiteList.get(visiteList.size() - 1);
        assertThat(testVisite.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testVisite.getDate()).isEqualTo(DEFAULT_DATE);
    }

    @Test
    @Transactional
    void fullUpdateVisiteWithPatch() throws Exception {
        // Initialize the database
        visiteRepository.saveAndFlush(visite);

        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();

        // Update the visite using partial update
        Visite partialUpdatedVisite = new Visite();
        partialUpdatedVisite.setId(visite.getId());

        partialUpdatedVisite.code(UPDATED_CODE).date(UPDATED_DATE);

        restVisiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedVisite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedVisite))
            )
            .andExpect(status().isOk());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
        Visite testVisite = visiteList.get(visiteList.size() - 1);
        assertThat(testVisite.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testVisite.getDate()).isEqualTo(UPDATED_DATE);
    }

    @Test
    @Transactional
    void patchNonExistingVisite() throws Exception {
        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();
        visite.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restVisiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, visite.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchVisite() throws Exception {
        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();
        visite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisiteMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(visite))
            )
            .andExpect(status().isBadRequest());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamVisite() throws Exception {
        int databaseSizeBeforeUpdate = visiteRepository.findAll().size();
        visite.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restVisiteMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(visite)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Visite in the database
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteVisite() throws Exception {
        // Initialize the database
        visiteRepository.saveAndFlush(visite);

        int databaseSizeBeforeDelete = visiteRepository.findAll().size();

        // Delete the visite
        restVisiteMockMvc
            .perform(delete(ENTITY_API_URL_ID, visite.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Visite> visiteList = visiteRepository.findAll();
        assertThat(visiteList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
