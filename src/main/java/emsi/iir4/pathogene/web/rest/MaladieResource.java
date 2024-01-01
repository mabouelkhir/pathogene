package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.domain.Maladie;
import emsi.iir4.pathogene.repository.MaladieRepository;
import emsi.iir4.pathogene.service.FileStorageService;
import emsi.iir4.pathogene.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.*;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link emsi.iir4.pathogene.domain.Maladie}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class MaladieResource {

    private final Logger log = LoggerFactory.getLogger(MaladieResource.class);

    private static final String ENTITY_NAME = "maladie";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final FileStorageService fileStorageService;

    private final MaladieRepository maladieRepository;

    public MaladieResource(FileStorageService fileStorageService, MaladieRepository maladieRepository) {
        this.fileStorageService = fileStorageService;
        this.maladieRepository = maladieRepository;
    }

    /**
     * {@code POST  /maladies} : Create a new maladie.
     *
     * @param maladie the maladie to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new maladie, or with status {@code 400 (Bad Request)} if the maladie has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/maladies")
    public ResponseEntity<Maladie> createMaladie(@Valid @RequestBody Maladie maladie) throws URISyntaxException {
        log.debug("REST request to save Maladie : {}", maladie);
        if (maladie.getId() != null) {
            throw new BadRequestAlertException("A new maladie cannot already have an ID", ENTITY_NAME, "idexists");
        }
        maladie.setCode("MAL-" + UUID.randomUUID().toString());

        Maladie result = maladieRepository.save(maladie);
        return ResponseEntity
            .created(new URI("/api/maladies/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    @PostMapping("/maladies/uploadModel/{id}")
    public ResponseEntity<String> uploadModel(
        @PathVariable Long id,
        @RequestParam("imageWidth") Long imageWidth,
        @RequestParam("imageHeight") Long imageHeight,
        @RequestParam("modelFile") MultipartFile modelFile,
        @RequestParam Map<String, String> classNames
    ) {
        try {
            Maladie maladie_result = maladieRepository.findById(id).orElse(null);

            Map<Integer, String> classNamesMapping = new HashMap<>();
            for (Map.Entry<String, String> entry : classNames.entrySet()) {
                if (entry.getKey().startsWith("classNames[")) {
                    // Extract class number from the key
                    int classNumber = Integer.parseInt(entry.getKey().replaceAll("\\D+", ""));
                    classNamesMapping.put(classNumber, entry.getValue());
                }
            }

            if (maladie_result != null) {
                // Récupérer le nom de l'ancien fichier
                String oldFileName = maladie_result.getModeleFileName();

                // Supprimer l'ancien fichier s'il existe
                if (oldFileName != null && !oldFileName.isEmpty()) {
                    this.fileStorageService.deleteModelFile(oldFileName);
                }

                // Logic to save the new model and size
                String newFileName = this.fileStorageService.uploadModelFile(modelFile, maladie_result.getNom().toLowerCase(), imageWidth);

                maladie_result.setWidth(imageWidth);
                maladie_result.setHeight(imageHeight);
                maladie_result.setModeleFileName(newFileName);
                maladie_result.setModeleContentType(modelFile.getContentType());

                // Set the updated class names
                // Save class names
                maladie_result.setClassNamesMapping(classNamesMapping);

                // Save the updated Maladie object
                maladieRepository.save(maladie_result);
            }

            return ResponseEntity.ok("Model uploaded successfully");
        } catch (Exception e) {
            // Handle exceptions, log errors, and return an appropriate response
            return ResponseEntity.status(500).body(e.getMessage());
        }
    }

    public Map<Integer, String> convertClassNames(Map<String, String> classNames) {
        Map<Integer, String> convertedClassNames = new HashMap<>();
        for (Map.Entry<String, String> entry : classNames.entrySet()) {
            int classNumber = Integer.parseInt(entry.getKey());
            convertedClassNames.put(classNumber, entry.getValue());
        }
        return convertedClassNames;
    }

    /**
     * {@code PUT  /maladies/:id} : Updates an existing maladie.
     *
     * @param id the id of the maladie to save.
     * @param maladie the maladie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated maladie,
     * or with status {@code 400 (Bad Request)} if the maladie is not valid,
     * or with status {@code 500 (Internal Server Error)} if the maladie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/maladies/{id}")
    public ResponseEntity<Maladie> updateMaladie(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Maladie maladie
    ) throws URISyntaxException {
        log.debug("REST request to update Maladie : {}, {}", id, maladie);
        if (maladie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maladie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maladieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Maladie result = maladieRepository.save(maladie);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maladie.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /maladies/:id} : Partial updates given fields of an existing maladie, field will ignore if it is null
     *
     * @param id the id of the maladie to save.
     * @param maladie the maladie to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated maladie,
     * or with status {@code 400 (Bad Request)} if the maladie is not valid,
     * or with status {@code 404 (Not Found)} if the maladie is not found,
     * or with status {@code 500 (Internal Server Error)} if the maladie couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/maladies/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Maladie> partialUpdateMaladie(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Maladie maladie
    ) throws URISyntaxException {
        log.debug("REST request to partial update Maladie partially : {}, {}", id, maladie);
        if (maladie.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, maladie.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!maladieRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Maladie> result = maladieRepository
            .findById(maladie.getId())
            .map(existingMaladie -> {
                if (maladie.getCode() != null) {
                    existingMaladie.setCode(maladie.getCode());
                }
                if (maladie.getNom() != null) {
                    existingMaladie.setNom(maladie.getNom());
                }

                return existingMaladie;
            })
            .map(maladieRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, maladie.getId().toString())
        );
    }

    /**
     * {@code GET  /maladies} : get all the maladies.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of maladies in body.
     */
    @GetMapping("/maladies")
    public ResponseEntity<List<Maladie>> getAllMaladies(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Maladies");
        Page<Maladie> page = maladieRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /maladies/:id} : get the "id" maladie.
     *
     * @param id the id of the maladie to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the maladie, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/maladies/{id}")
    public ResponseEntity<Maladie> getMaladie(@PathVariable Long id) {
        log.debug("REST request to get Maladie : {}", id);
        Optional<Maladie> maladie = maladieRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(maladie);
    }

    /**
     * {@code DELETE  /maladies/:id} : delete the "id" maladie.
     *
     * @param id the id of the maladie to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/maladies/{id}")
    public ResponseEntity<Void> deleteMaladie(@PathVariable Long id) {
        log.debug("REST request to delete Maladie : {}", id);
        maladieRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
