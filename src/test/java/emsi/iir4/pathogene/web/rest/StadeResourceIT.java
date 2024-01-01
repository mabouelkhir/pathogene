package emsi.iir4.pathogene.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import emsi.iir4.pathogene.IntegrationTest;
import emsi.iir4.pathogene.domain.Stade;
import emsi.iir4.pathogene.repository.StadeRepository;
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
 * Integration tests for the {@link StadeResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class StadeResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_LEVEL = "AAAAAAAAAA";
    private static final String UPDATED_LEVEL = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/stades";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private StadeRepository stadeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restStadeMockMvc;

    private Stade stade;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stade createEntity(EntityManager em) {
        Stade stade = new Stade().code(DEFAULT_CODE).level(DEFAULT_LEVEL).description(DEFAULT_DESCRIPTION);
        return stade;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Stade createUpdatedEntity(EntityManager em) {
        Stade stade = new Stade().code(UPDATED_CODE).level(UPDATED_LEVEL).description(UPDATED_DESCRIPTION);
        return stade;
    }

    @BeforeEach
    public void initTest() {
        stade = createEntity(em);
    }

    @Test
    @Transactional
    void createStade() throws Exception {
        int databaseSizeBeforeCreate = stadeRepository.findAll().size();
        // Create the Stade
        restStadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isCreated());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate + 1);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testStade.getLevel()).isEqualTo(DEFAULT_LEVEL);
        assertThat(testStade.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    @Transactional
    void createStadeWithExistingId() throws Exception {
        // Create the Stade with an existing ID
        stade.setId(1L);

        int databaseSizeBeforeCreate = stadeRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restStadeMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllStades() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        // Get all the stadeList
        restStadeMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(stade.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].level").value(hasItem(DEFAULT_LEVEL)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    @Transactional
    void getStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        // Get the stade
        restStadeMockMvc
            .perform(get(ENTITY_API_URL_ID, stade.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(stade.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.level").value(DEFAULT_LEVEL))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    @Transactional
    void getNonExistingStade() throws Exception {
        // Get the stade
        restStadeMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade
        Stade updatedStade = stadeRepository.findById(stade.getId()).get();
        // Disconnect from session so that the updates on updatedStade are not directly saved in db
        em.detach(updatedStade);
        updatedStade.code(UPDATED_CODE).level(UPDATED_LEVEL).description(UPDATED_DESCRIPTION);

        restStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedStade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedStade))
            )
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testStade.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testStade.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void putNonExistingStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, stade.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateStadeWithPatch() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade using partial update
        Stade partialUpdatedStade = new Stade();
        partialUpdatedStade.setId(stade.getId());

        partialUpdatedStade.code(UPDATED_CODE).level(UPDATED_LEVEL).description(UPDATED_DESCRIPTION);

        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStade))
            )
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testStade.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testStade.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void fullUpdateStadeWithPatch() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();

        // Update the stade using partial update
        Stade partialUpdatedStade = new Stade();
        partialUpdatedStade.setId(stade.getId());

        partialUpdatedStade.code(UPDATED_CODE).level(UPDATED_LEVEL).description(UPDATED_DESCRIPTION);

        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedStade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedStade))
            )
            .andExpect(status().isOk());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
        Stade testStade = stadeList.get(stadeList.size() - 1);
        assertThat(testStade.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testStade.getLevel()).isEqualTo(UPDATED_LEVEL);
        assertThat(testStade.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    @Transactional
    void patchNonExistingStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, stade.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(stade))
            )
            .andExpect(status().isBadRequest());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamStade() throws Exception {
        int databaseSizeBeforeUpdate = stadeRepository.findAll().size();
        stade.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restStadeMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(stade)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Stade in the database
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteStade() throws Exception {
        // Initialize the database
        stadeRepository.saveAndFlush(stade);

        int databaseSizeBeforeDelete = stadeRepository.findAll().size();

        // Delete the stade
        restStadeMockMvc
            .perform(delete(ENTITY_API_URL_ID, stade.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Stade> stadeList = stadeRepository.findAll();
        assertThat(stadeList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
