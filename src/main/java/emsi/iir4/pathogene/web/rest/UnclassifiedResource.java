package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.domain.Unclassified;
import emsi.iir4.pathogene.repository.UnclassifiedRepository;
import emsi.iir4.pathogene.web.rest.errors.BadRequestAlertException;
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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link emsi.iir4.pathogene.domain.Unclassified}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class UnclassifiedResource {

    private final Logger log = LoggerFactory.getLogger(UnclassifiedResource.class);

    private static final String ENTITY_NAME = "unclassified";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final UnclassifiedRepository unclassifiedRepository;

    public UnclassifiedResource(UnclassifiedRepository unclassifiedRepository) {
        this.unclassifiedRepository = unclassifiedRepository;
    }

    /**
     * {@code POST  /unclassifieds} : Create a new unclassified.
     *
     * @param unclassified the unclassified to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new unclassified, or with status {@code 400 (Bad Request)} if the unclassified has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/unclassifieds")
    public ResponseEntity<Unclassified> createUnclassified(@Valid @RequestBody Unclassified unclassified) throws URISyntaxException {
        log.debug("REST request to save Unclassified : {}", unclassified);
        if (unclassified.getId() != null) {
            throw new BadRequestAlertException("A new unclassified cannot already have an ID", ENTITY_NAME, "idexists");
        }
        unclassified.setCode("UNC-" + UUID.randomUUID().toString());

        Unclassified result = unclassifiedRepository.save(unclassified);
        return ResponseEntity
            .created(new URI("/api/unclassifieds/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /unclassifieds/:id} : Updates an existing unclassified.
     *
     * @param id the id of the unclassified to save.
     * @param unclassified the unclassified to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unclassified,
     * or with status {@code 400 (Bad Request)} if the unclassified is not valid,
     * or with status {@code 500 (Internal Server Error)} if the unclassified couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/unclassifieds/{id}")
    public ResponseEntity<Unclassified> updateUnclassified(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Unclassified unclassified
    ) throws URISyntaxException {
        log.debug("REST request to update Unclassified : {}, {}", id, unclassified);
        if (unclassified.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unclassified.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unclassifiedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Unclassified result = unclassifiedRepository.save(unclassified);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unclassified.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /unclassifieds/:id} : Partial updates given fields of an existing unclassified, field will ignore if it is null
     *
     * @param id the id of the unclassified to save.
     * @param unclassified the unclassified to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated unclassified,
     * or with status {@code 400 (Bad Request)} if the unclassified is not valid,
     * or with status {@code 404 (Not Found)} if the unclassified is not found,
     * or with status {@code 500 (Internal Server Error)} if the unclassified couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/unclassifieds/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Unclassified> partialUpdateUnclassified(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Unclassified unclassified
    ) throws URISyntaxException {
        log.debug("REST request to partial update Unclassified partially : {}, {}", id, unclassified);
        if (unclassified.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, unclassified.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!unclassifiedRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Unclassified> result = unclassifiedRepository
            .findById(unclassified.getId())
            .map(existingUnclassified -> {
                if (unclassified.getCode() != null) {
                    existingUnclassified.setCode(unclassified.getCode());
                }
                if (unclassified.getPhoto() != null) {
                    existingUnclassified.setPhoto(unclassified.getPhoto());
                }
                if (unclassified.getPhotoContentType() != null) {
                    existingUnclassified.setPhotoContentType(unclassified.getPhotoContentType());
                }

                return existingUnclassified;
            })
            .map(unclassifiedRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, unclassified.getId().toString())
        );
    }

    /**
     * {@code GET  /unclassifieds} : get all the unclassifieds.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of unclassifieds in body.
     */
    @GetMapping("/unclassifieds")
    public ResponseEntity<List<Unclassified>> getAllUnclassifieds(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Unclassifieds");
        Page<Unclassified> page = unclassifiedRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /unclassifieds/:id} : get the "id" unclassified.
     *
     * @param id the id of the unclassified to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the unclassified, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/unclassifieds/{id}")
    public ResponseEntity<Unclassified> getUnclassified(@PathVariable Long id) {
        log.debug("REST request to get Unclassified : {}", id);
        Optional<Unclassified> unclassified = unclassifiedRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(unclassified);
    }

    /**
     * {@code DELETE  /unclassifieds/:id} : delete the "id" unclassified.
     *
     * @param id the id of the unclassified to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/unclassifieds/{id}")
    public ResponseEntity<Void> deleteUnclassified(@PathVariable Long id) {
        log.debug("REST request to delete Unclassified : {}", id);
        unclassifiedRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
