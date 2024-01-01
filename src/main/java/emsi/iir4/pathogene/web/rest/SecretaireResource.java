package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.domain.Patient;
import emsi.iir4.pathogene.domain.Secretaire;
import emsi.iir4.pathogene.domain.User;
import emsi.iir4.pathogene.repository.PatientRepository;
import emsi.iir4.pathogene.repository.SecretaireRepository;
import emsi.iir4.pathogene.security.AuthoritiesConstants;
import emsi.iir4.pathogene.service.UserService;
import emsi.iir4.pathogene.service.dto.PatientUserDTO;
import emsi.iir4.pathogene.web.rest.errors.BadRequestAlertException;
import emsi.iir4.pathogene.web.rest.vm.ManagedUserVM;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link emsi.iir4.pathogene.domain.Secretaire}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class SecretaireResource {

    private final Logger log = LoggerFactory.getLogger(SecretaireResource.class);

    private static final String ENTITY_NAME = "secretaire";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final SecretaireRepository secretaireRepository;

    private final PatientRepository patientRepository;

    private final AccountResource accountResource;

    private final UserService userService;

    public SecretaireResource(
        SecretaireRepository secretaireRepository,
        PatientRepository patientRepository,
        AccountResource accountResource,
        UserService userService
    ) {
        this.secretaireRepository = secretaireRepository;
        this.patientRepository = patientRepository;
        this.accountResource = accountResource;
        this.userService = userService;
    }

    /**
     * {@code POST  /secretaires} : Create a new secretaire.
     *
     * @param secretaire the secretaire to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new secretaire, or with status {@code 400 (Bad Request)} if the secretaire has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/secretaires")
    public ResponseEntity<Secretaire> createSecretaire(@Valid @RequestBody Secretaire secretaire) throws URISyntaxException {
        log.debug("REST request to save Secretaire : {}", secretaire);
        if (secretaire.getId() != null) {
            throw new BadRequestAlertException("A new secretaire cannot already have an ID", ENTITY_NAME, "idexists");
        }
        secretaire.setCode("SEC-" + UUID.randomUUID().toString());

        Secretaire result = secretaireRepository.save(secretaire);
        return ResponseEntity
            .created(new URI("/api/secretaires/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("patient/register")
    @PreAuthorize("hasAuthority('" + AuthoritiesConstants.SECRETAIRE + "')")
    public ResponseEntity<Patient> registerPatient(@Valid @RequestBody PatientUserDTO patientUserDTO) throws URISyntaxException {
        log.debug("REST request to save Patient : {}", patientUserDTO);
        Patient patient = patientUserDTO.getPatient();
        ManagedUserVM Puser = patientUserDTO.getUser();
        if (patient.getId() != null) {
            throw new BadRequestAlertException("A new patient cannot already have an ID", ENTITY_NAME, "idexists");
        }
        patient.setSecretaire(accountResource.getAccount().getSecretaire());
        User user = userService.registerUser(Puser, Puser.getPassword());
        patient.setUser(user);
        patient.setCode("PAT-" + UUID.randomUUID().toString());
        return ResponseEntity
            .created(new URI("/api/patient/register/" + patient.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, patient.getId().toString()))
            .body(patient);
    }

    /**
     * {@code PUT  /secretaires/:id} : Updates an existing secretaire.
     *
     * @param id the id of the secretaire to save.
     * @param secretaire the secretaire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated secretaire,
     * or with status {@code 400 (Bad Request)} if the secretaire is not valid,
     * or with status {@code 500 (Internal Server Error)} if the secretaire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/secretaires/{id}")
    public ResponseEntity<Secretaire> updateSecretaire(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Secretaire secretaire
    ) throws URISyntaxException {
        log.debug("REST request to update Secretaire : {}, {}", id, secretaire);
        if (secretaire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, secretaire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!secretaireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Secretaire result = secretaireRepository.save(secretaire);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, secretaire.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /secretaires/:id} : Partial updates given fields of an existing secretaire, field will ignore if it is null
     *
     * @param id the id of the secretaire to save.
     * @param secretaire the secretaire to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated secretaire,
     * or with status {@code 400 (Bad Request)} if the secretaire is not valid,
     * or with status {@code 404 (Not Found)} if the secretaire is not found,
     * or with status {@code 500 (Internal Server Error)} if the secretaire couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/secretaires/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Secretaire> partialUpdateSecretaire(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Secretaire secretaire
    ) throws URISyntaxException {
        log.debug("REST request to partial update Secretaire partially : {}, {}", id, secretaire);
        if (secretaire.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, secretaire.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!secretaireRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Secretaire> result = secretaireRepository
            .findById(secretaire.getId())
            .map(existingSecretaire -> {
                if (secretaire.getCode() != null) {
                    existingSecretaire.setCode(secretaire.getCode());
                }
                if (secretaire.getNom() != null) {
                    existingSecretaire.setNom(secretaire.getNom());
                }
                if (secretaire.getNumEmp() != null) {
                    existingSecretaire.setNumEmp(secretaire.getNumEmp());
                }
                if (secretaire.getPrenom() != null) {
                    existingSecretaire.setPrenom(secretaire.getPrenom());
                }
                if (secretaire.getAdmin() != null) {
                    existingSecretaire.setAdmin(secretaire.getAdmin());
                }
                if (secretaire.getPhoto() != null) {
                    existingSecretaire.setPhoto(secretaire.getPhoto());
                }
                if (secretaire.getPhotoContentType() != null) {
                    existingSecretaire.setPhotoContentType(secretaire.getPhotoContentType());
                }

                return existingSecretaire;
            })
            .map(secretaireRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, secretaire.getId().toString())
        );
    }

    /**
     * {@code GET  /secretaires} : get all the secretaires.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of secretaires in body.
     */
    @GetMapping("/secretaires")
    public ResponseEntity<List<Secretaire>> getAllSecretaires(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Secretaires");
        Page<Secretaire> page = secretaireRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /secretaires/:id} : get the "id" secretaire.
     *
     * @param id the id of the secretaire to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the secretaire, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/secretaires/{id}")
    public ResponseEntity<Secretaire> getSecretaire(@PathVariable Long id) {
        log.debug("REST request to get Secretaire : {}", id);
        Optional<Secretaire> secretaire = secretaireRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(secretaire);
    }

    /**
     * {@code DELETE  /secretaires/:id} : delete the "id" secretaire.
     *
     * @param id the id of the secretaire to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/secretaires/{id}")
    public ResponseEntity<Void> deleteSecretaire(@PathVariable Long id) {
        log.debug("REST request to delete Secretaire : {}", id);
        secretaireRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
