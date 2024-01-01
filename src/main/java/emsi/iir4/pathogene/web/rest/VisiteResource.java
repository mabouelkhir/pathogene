package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.domain.Visite;
import emsi.iir4.pathogene.repository.VisiteRepository;
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
 * REST controller for managing {@link emsi.iir4.pathogene.domain.Visite}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class VisiteResource {

    private final Logger log = LoggerFactory.getLogger(VisiteResource.class);

    private static final String ENTITY_NAME = "visite";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final VisiteRepository visiteRepository;

    public VisiteResource(VisiteRepository visiteRepository) {
        this.visiteRepository = visiteRepository;
    }

    /**
     * {@code POST  /visites} : Create a new visite.
     *
     * @param visite the visite to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new visite, or with status {@code 400 (Bad Request)} if the visite has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/visites")
    public ResponseEntity<Visite> createVisite(@Valid @RequestBody Visite visite) throws URISyntaxException {
        log.debug("REST request to save Visite : {}", visite);
        if (visite.getId() != null) {
            throw new BadRequestAlertException("A new visite cannot already have an ID", ENTITY_NAME, "idexists");
        }
        visite.setCode("VIS-" + UUID.randomUUID().toString());

        Visite result = visiteRepository.save(visite);
        return ResponseEntity
            .created(new URI("/api/visites/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /visites/:id} : Updates an existing visite.
     *
     * @param id the id of the visite to save.
     * @param visite the visite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visite,
     * or with status {@code 400 (Bad Request)} if the visite is not valid,
     * or with status {@code 500 (Internal Server Error)} if the visite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/visites/{id}")
    public ResponseEntity<Visite> updateVisite(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Visite visite
    ) throws URISyntaxException {
        log.debug("REST request to update Visite : {}, {}", id, visite);
        if (visite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Visite result = visiteRepository.save(visite);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visite.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /visites/:id} : Partial updates given fields of an existing visite, field will ignore if it is null
     *
     * @param id the id of the visite to save.
     * @param visite the visite to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated visite,
     * or with status {@code 400 (Bad Request)} if the visite is not valid,
     * or with status {@code 404 (Not Found)} if the visite is not found,
     * or with status {@code 500 (Internal Server Error)} if the visite couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/visites/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Visite> partialUpdateVisite(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Visite visite
    ) throws URISyntaxException {
        log.debug("REST request to partial update Visite partially : {}, {}", id, visite);
        if (visite.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, visite.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!visiteRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Visite> result = visiteRepository
            .findById(visite.getId())
            .map(existingVisite -> {
                if (visite.getCode() != null) {
                    existingVisite.setCode(visite.getCode());
                }
                if (visite.getDate() != null) {
                    existingVisite.setDate(visite.getDate());
                }

                return existingVisite;
            })
            .map(visiteRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, visite.getId().toString())
        );
    }

    /**
     * {@code GET  /visites} : get all the visites.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of visites in body.
     */
    @GetMapping("/visites")
    public ResponseEntity<List<Visite>> getAllVisites(@org.springdoc.api.annotations.ParameterObject Pageable pageable) {
        log.debug("REST request to get a page of Visites");
        Page<Visite> page = visiteRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /visites/:id} : get the "id" visite.
     *
     * @param id the id of the visite to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the visite, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/visites/{id}")
    public ResponseEntity<Visite> getVisite(@PathVariable Long id) {
        log.debug("REST request to get Visite : {}", id);
        Optional<Visite> visite = visiteRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(visite);
    }

    /**
     * {@code DELETE  /visites/:id} : delete the "id" visite.
     *
     * @param id the id of the visite to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/visites/{id}")
    public ResponseEntity<Void> deleteVisite(@PathVariable Long id) {
        log.debug("REST request to delete Visite : {}", id);
        visiteRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }

    @GetMapping("/visites/{id}/patient")
    public ResponseEntity<List<Visite>> getVisiteByPatient(
        @PathVariable Long id,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get Visite : {}", id);
        Page<Visite> page = visiteRepository.findByRendezVousPatientId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }
}
