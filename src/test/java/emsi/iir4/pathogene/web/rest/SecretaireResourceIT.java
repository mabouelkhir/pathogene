package emsi.iir4.pathogene.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import emsi.iir4.pathogene.IntegrationTest;
import emsi.iir4.pathogene.domain.Secretaire;
import emsi.iir4.pathogene.repository.SecretaireRepository;
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
 * Integration tests for the {@link SecretaireResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class SecretaireResourceIT {

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_NOM = "AAAAAAAAAA";
    private static final String UPDATED_NOM = "BBBBBBBBBB";

    private static final String DEFAULT_NUM_EMP = "AAAAAAAAAA";
    private static final String UPDATED_NUM_EMP = "BBBBBBBBBB";

    private static final String DEFAULT_PRENOM = "AAAAAAAAAA";
    private static final String UPDATED_PRENOM = "BBBBBBBBBB";

    private static final Boolean DEFAULT_ADMIN = false;
    private static final Boolean UPDATED_ADMIN = true;

    private static final byte[] DEFAULT_PHOTO = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_PHOTO = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_PHOTO_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_PHOTO_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/secretaires";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private SecretaireRepository secretaireRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restSecretaireMockMvc;

    private Secretaire secretaire;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Secretaire createEntity(EntityManager em) {
        Secretaire secretaire = new Secretaire()
            .code(DEFAULT_CODE)
            .nom(DEFAULT_NOM)
            .numEmp(DEFAULT_NUM_EMP)
            .prenom(DEFAULT_PRENOM)
            .admin(DEFAULT_ADMIN)
            .photo(DEFAULT_PHOTO)
            .photoContentType(DEFAULT_PHOTO_CONTENT_TYPE);
        return secretaire;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Secretaire createUpdatedEntity(EntityManager em) {
        Secretaire secretaire = new Secretaire()
            .code(UPDATED_CODE)
            .nom(UPDATED_NOM)
            .numEmp(UPDATED_NUM_EMP)
            .prenom(UPDATED_PRENOM)
            .admin(UPDATED_ADMIN)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);
        return secretaire;
    }

    @BeforeEach
    public void initTest() {
        secretaire = createEntity(em);
    }

    @Test
    @Transactional
    void createSecretaire() throws Exception {
        int databaseSizeBeforeCreate = secretaireRepository.findAll().size();
        // Create the Secretaire
        restSecretaireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(secretaire)))
            .andExpect(status().isCreated());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeCreate + 1);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testSecretaire.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testSecretaire.getNumEmp()).isEqualTo(DEFAULT_NUM_EMP);
        assertThat(testSecretaire.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testSecretaire.getAdmin()).isEqualTo(DEFAULT_ADMIN);
        assertThat(testSecretaire.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testSecretaire.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void createSecretaireWithExistingId() throws Exception {
        // Create the Secretaire with an existing ID
        secretaire.setId(1L);

        int databaseSizeBeforeCreate = secretaireRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restSecretaireMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(secretaire)))
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllSecretaires() throws Exception {
        // Initialize the database
        secretaireRepository.saveAndFlush(secretaire);

        // Get all the secretaireList
        restSecretaireMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(secretaire.getId().intValue())))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].nom").value(hasItem(DEFAULT_NOM)))
            .andExpect(jsonPath("$.[*].numEmp").value(hasItem(DEFAULT_NUM_EMP)))
            .andExpect(jsonPath("$.[*].prenom").value(hasItem(DEFAULT_PRENOM)))
            .andExpect(jsonPath("$.[*].admin").value(hasItem(DEFAULT_ADMIN.booleanValue())))
            .andExpect(jsonPath("$.[*].photoContentType").value(hasItem(DEFAULT_PHOTO_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].photo").value(hasItem(Base64Utils.encodeToString(DEFAULT_PHOTO))));
    }

    @Test
    @Transactional
    void getSecretaire() throws Exception {
        // Initialize the database
        secretaireRepository.saveAndFlush(secretaire);

        // Get the secretaire
        restSecretaireMockMvc
            .perform(get(ENTITY_API_URL_ID, secretaire.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(secretaire.getId().intValue()))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.nom").value(DEFAULT_NOM))
            .andExpect(jsonPath("$.numEmp").value(DEFAULT_NUM_EMP))
            .andExpect(jsonPath("$.prenom").value(DEFAULT_PRENOM))
            .andExpect(jsonPath("$.admin").value(DEFAULT_ADMIN.booleanValue()))
            .andExpect(jsonPath("$.photoContentType").value(DEFAULT_PHOTO_CONTENT_TYPE))
            .andExpect(jsonPath("$.photo").value(Base64Utils.encodeToString(DEFAULT_PHOTO)));
    }

    @Test
    @Transactional
    void getNonExistingSecretaire() throws Exception {
        // Get the secretaire
        restSecretaireMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingSecretaire() throws Exception {
        // Initialize the database
        secretaireRepository.saveAndFlush(secretaire);

        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();

        // Update the secretaire
        Secretaire updatedSecretaire = secretaireRepository.findById(secretaire.getId()).get();
        // Disconnect from session so that the updates on updatedSecretaire are not directly saved in db
        em.detach(updatedSecretaire);
        updatedSecretaire
            .code(UPDATED_CODE)
            .nom(UPDATED_NOM)
            .numEmp(UPDATED_NUM_EMP)
            .prenom(UPDATED_PRENOM)
            .admin(UPDATED_ADMIN)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restSecretaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedSecretaire.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedSecretaire))
            )
            .andExpect(status().isOk());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSecretaire.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testSecretaire.getNumEmp()).isEqualTo(UPDATED_NUM_EMP);
        assertThat(testSecretaire.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testSecretaire.getAdmin()).isEqualTo(UPDATED_ADMIN);
        assertThat(testSecretaire.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testSecretaire.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void putNonExistingSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, secretaire.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(secretaire)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateSecretaireWithPatch() throws Exception {
        // Initialize the database
        secretaireRepository.saveAndFlush(secretaire);

        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();

        // Update the secretaire using partial update
        Secretaire partialUpdatedSecretaire = new Secretaire();
        partialUpdatedSecretaire.setId(secretaire.getId());

        partialUpdatedSecretaire.code(UPDATED_CODE).admin(UPDATED_ADMIN);

        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSecretaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSecretaire))
            )
            .andExpect(status().isOk());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSecretaire.getNom()).isEqualTo(DEFAULT_NOM);
        assertThat(testSecretaire.getNumEmp()).isEqualTo(DEFAULT_NUM_EMP);
        assertThat(testSecretaire.getPrenom()).isEqualTo(DEFAULT_PRENOM);
        assertThat(testSecretaire.getAdmin()).isEqualTo(UPDATED_ADMIN);
        assertThat(testSecretaire.getPhoto()).isEqualTo(DEFAULT_PHOTO);
        assertThat(testSecretaire.getPhotoContentType()).isEqualTo(DEFAULT_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void fullUpdateSecretaireWithPatch() throws Exception {
        // Initialize the database
        secretaireRepository.saveAndFlush(secretaire);

        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();

        // Update the secretaire using partial update
        Secretaire partialUpdatedSecretaire = new Secretaire();
        partialUpdatedSecretaire.setId(secretaire.getId());

        partialUpdatedSecretaire
            .code(UPDATED_CODE)
            .nom(UPDATED_NOM)
            .numEmp(UPDATED_NUM_EMP)
            .prenom(UPDATED_PRENOM)
            .admin(UPDATED_ADMIN)
            .photo(UPDATED_PHOTO)
            .photoContentType(UPDATED_PHOTO_CONTENT_TYPE);

        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedSecretaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedSecretaire))
            )
            .andExpect(status().isOk());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
        Secretaire testSecretaire = secretaireList.get(secretaireList.size() - 1);
        assertThat(testSecretaire.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testSecretaire.getNom()).isEqualTo(UPDATED_NOM);
        assertThat(testSecretaire.getNumEmp()).isEqualTo(UPDATED_NUM_EMP);
        assertThat(testSecretaire.getPrenom()).isEqualTo(UPDATED_PRENOM);
        assertThat(testSecretaire.getAdmin()).isEqualTo(UPDATED_ADMIN);
        assertThat(testSecretaire.getPhoto()).isEqualTo(UPDATED_PHOTO);
        assertThat(testSecretaire.getPhotoContentType()).isEqualTo(UPDATED_PHOTO_CONTENT_TYPE);
    }

    @Test
    @Transactional
    void patchNonExistingSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, secretaire.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isBadRequest());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamSecretaire() throws Exception {
        int databaseSizeBeforeUpdate = secretaireRepository.findAll().size();
        secretaire.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restSecretaireMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(secretaire))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Secretaire in the database
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteSecretaire() throws Exception {
        // Initialize the database
        secretaireRepository.saveAndFlush(secretaire);

        int databaseSizeBeforeDelete = secretaireRepository.findAll().size();

        // Delete the secretaire
        restSecretaireMockMvc
            .perform(delete(ENTITY_API_URL_ID, secretaire.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Secretaire> secretaireList = secretaireRepository.findAll();
        assertThat(secretaireList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
