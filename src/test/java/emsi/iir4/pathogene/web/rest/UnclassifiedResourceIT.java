package emsi.iir4.pathogene.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import emsi.iir4.pathogene.IntegrationTest;
import emsi.iir4.pathogene.domain.Unclassified;
import emsi.iir4.pathogene.repository.UnclassifiedRepository;
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
import org.springframework.util.Base64Utils;

/**
 * Integration tests for the {@link UnclassifiedResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class UnclassifiedResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/unclassifieds";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private UnclassifiedRepository unclassifiedRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restUnclassifiedMockMvc;

    private Unclassified unclassified;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Unclassified createEntity(EntityManager em) {
        Unclassified unclassified = new Unclassified().code(DEFAULT_CODE).photo(DEFAULT_PHOTO).photoContentType(DEFAULT_PHOTO_CONTENT_TYPE);
        return unclassified;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Unclassified createUpdatedEntity(EntityManager em) {
        Unclassified unclassified = new Unclassified().code(UPDATED_CODE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);
        return unclassified;
    }

    @BeforeEach
    public void initTest() {
        unclassified = createEntity(em);
    }

    @Test
    @Transactional
    void createUnclassified() throws Exception {
        int databaseSizeBeforeCreate = unclassifiedRepository.findAll().size();
        // Create the Unclassified
        restUnclassifiedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(unclassified)))
            .andExpect(status().isCreated());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeCreate + 1);
        Unclassified testUnclassified = unclassifiedList.get(unclassifiedList.size() - 1);
        assertThat(testUnclassified.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testUnclassified.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testUnclassified.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createUnclassifiedWithExistingId() throws Exception {
        // Create the Unclassified with an existing ID
        unclassified.setId(1L);

        int databaseSizeBeforeCreate = unclassifiedRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restUnclassifiedMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(unclassified)))
            .andExpect(status().isBadRequest());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllUnclassifieds() throws Exception {
        // Initialize the database
        unclassifiedRepository.saveAndFlush(unclassified);

        // Get all the unclassifiedList
        restUnclassifiedMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(unclassified.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))));
    }

    @Test
    @Transactional
    void getUnclassified() throws Exception {
        // Initialize the database
        unclassifiedRepository.saveAndFlush(unclassified);

        // Get the unclassified
        restUnclassifiedMockMvc
            .perform(get(ENTITY_API_URL_ID, unclassified.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(unclassified.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)));
    }

    @Test
    @Transactional
    void getNonExistingUnclassified() throws Exception {
        // Get the unclassified
        restUnclassifiedMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingUnclassified() throws Exception {
        // Initialize the database
        unclassifiedRepository.saveAndFlush(unclassified);

        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();

        // Update the unclassified
        Unclassified updatedUnclassified = unclassifiedRepository.findById(unclassified.getId()).get();
        // Disconnect from session so that the updates on updatedUnclassified are not directly saved in db
        em.detach(updatedUnclassified);
        updatedUnclassified.code(UPDATED_CODE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restUnclassifiedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedUnclassified.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedUnclassified))
            )
            .andExpect(status().isOk());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
        Unclassified testUnclassified = unclassifiedList.get(unclassifiedList.size() - 1);
        assertThat(testUnclassified.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testUnclassified.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testUnclassified.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingUnclassified() throws Exception {
        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();
        unclassified.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnclassifiedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, unclassified.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(unclassified))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchUnclassified() throws Exception {
        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();
        unclassified.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnclassifiedMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(unclassified))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamUnclassified() throws Exception {
        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();
        unclassified.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnclassifiedMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(unclassified)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateUnclassifiedWithPatch() throws Exception {
        // Initialize the database
        unclassifiedRepository.saveAndFlush(unclassified);

        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();

        // Update the unclassified using partial update
        Unclassified partialUpdatedUnclassified = new Unclassified();
        partialUpdatedUnclassified.setId(unclassified.getId());

        partialUpdatedUnclassified.code(UPDATED_CODE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restUnclassifiedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnclassified.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUnclassified))
            )
            .andExpect(status().isOk());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
        Unclassified testUnclassified = unclassifiedList.get(unclassifiedList.size() - 1);
        assertThat(testUnclassified.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testUnclassified.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testUnclassified.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateUnclassifiedWithPatch() throws Exception {
        // Initialize the database
        unclassifiedRepository.saveAndFlush(unclassified);

        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();

        // Update the unclassified using partial update
        Unclassified partialUpdatedUnclassified = new Unclassified();
        partialUpdatedUnclassified.setId(unclassified.getId());

        partialUpdatedUnclassified.code(UPDATED_CODE).photo(UPDATED_PHOTO).photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restUnclassifiedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedUnclassified.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedUnclassified))
            )
            .andExpect(status().isOk());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
        Unclassified testUnclassified = unclassifiedList.get(unclassifiedList.size() - 1);
        assertThat(testUnclassified.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testUnclassified.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testUnclassified.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingUnclassified() throws Exception {
        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();
        unclassified.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restUnclassifiedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, unclassified.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(unclassified))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchUnclassified() throws Exception {
        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();
        unclassified.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnclassifiedMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(unclassified))
            )
            .andExpect(status().isBadRequest());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamUnclassified() throws Exception {
        int databaseSizeBeforeUpdate = unclassifiedRepository.findAll().size();
        unclassified.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restUnclassifiedMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(unclassified))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Unclassified in the database
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteUnclassified() throws Exception {
        // Initialize the database
        unclassifiedRepository.saveAndFlush(unclassified);

        int databaseSizeBeforeDelete = unclassifiedRepository.findAll().size();

        // Delete the unclassified
        restUnclassifiedMockMvc
            .perform(delete(ENTITY_API_URL_ID, unclassified.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Unclassified> unclassifiedList = unclassifiedRepository.findAll();
        assertThat(unclassifiedList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
