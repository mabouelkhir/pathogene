package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.domain.RendezVous;
import emsi.iir4.pathogene.repository.RendezVousRepository;
import emsi.iir4.pathogene.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;
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
 * REST controller for managing {@link emsi.iir4.pathogene.domain.RendezVous}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class RendezVousResource {

    private final Logger log = LoggerFactory.getLogger(RendezVousResource.class);

    private static final String ENTITY_NAME = "rendezVous";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final RendezVousRepository rendezVousRepository;

    public RendezVousResource(RendezVousRepository rendezVousRepository) {
        this.rendezVousRepository = rendezVousRepository;
    }

    /**
     * {@code POST  /rendez-vous} : Create a new rendezVous.
     *
     * @param rendezVous the rendezVous to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new rendezVous, or with status {@code 400 (Bad Request)} if the rendezVous has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/rendez-vous")
    public ResponseEntity<RendezVous> createRendezVous(@Valid @RequestBody RendezVous rendezVous) throws URISyntaxException {
        log.debug("REST request to save RendezVous : {}", rendezVous);
        if (rendezVous.getId() != null) {
            throw new BadRequestAlertException("A new rendezVous cannot already have an ID", ENTITY_NAME, "idexists");
        }
        rendezVous.setCode("RV-" + UUID.randomUUID().toString());

        RendezVous result = rendezVousRepository.save(rendezVous);
        return ResponseEntity
            .created(new URI("/api/rendez-vous/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /rendez-vous/:id} : Updates an existing rendezVous.
     *
     * @param id the id of the rendezVous to save.
     * @param rendezVous the rendezVous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rendezVous,
     * or with status {@code 400 (Bad Request)} if the rendezVous is not valid,
     * or with status {@code 500 (Internal Server Error)} if the rendezVous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/rendez-vous/{id}")
    public ResponseEntity<RendezVous> updateRendezVous(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody RendezVous rendezVous
    ) throws URISyntaxException {
        log.debug("REST request to update RendezVous : {}, {}", id, rendezVous);
        if (rendezVous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rendezVous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rendezVousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        RendezVous result = rendezVousRepository.save(rendezVous);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rendezVous.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /rendez-vous/:id} : Partial updates given fields of an existing rendezVous, field will ignore if it is null
     *
     * @param id the id of the rendezVous to save.
     * @param rendezVous the rendezVous to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated rendezVous,
     * or with status {@code 400 (Bad Request)} if the rendezVous is not valid,
     * or with status {@code 404 (Not Found)} if the rendezVous is not found,
     * or with status {@code 500 (Internal Server Error)} if the rendezVous couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/rendez-vous/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<RendezVous> partialUpdateRendezVous(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody RendezVous rendezVous
    ) throws URISyntaxException {
        log.debug("REST request to partial update RendezVous partially : {}, {}", id, rendezVous);
        if (rendezVous.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, rendezVous.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!rendezVousRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<RendezVous> result = rendezVousRepository
            .findById(rendezVous.getId())
            .map(existingRendezVous -> {
                if (rendezVous.getDate() != null) {
                    existingRendezVous.setDate(rendezVous.getDate());
                }
                if (rendezVous.getCode() != null) {
                    existingRendezVous.setCode(rendezVous.getCode());
                }
                if (rendezVous.getStatus() != null) {
                    existingRendezVous.setStatus(rendezVous.getStatus());
                }

                return existingRendezVous;
            })
            .map(rendezVousRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, rendezVous.getId().toString())
        );
    }

    /**
     * {@code GET  /rendez-vous} : get all the rendezVous.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of rendezVous in body.
     */
    @GetMapping("/rendez-vous")
    public ResponseEntity<List<RendezVous>> getAllRendezVous(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("visite-is-null".equals(filter)) {
            log.debug("REST request to get all RendezVouss where visite is null");
            return new ResponseEntity<>(
                StreamSupport
                    .stream(rendezVousRepository.findAll().spliterator(), false)
                    .filter(rendezVous -> rendezVous.getVisite() == null)
                    .collect(Collectors.toList()),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of RendezVous");
        Page<RendezVous> page = rendezVousRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /rendez-vous/:id} : get the "id" rendezVous.
     *
     * @param id the id of the rendezVous to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the rendezVous, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/rendez-vous/{id}")
    public ResponseEntity<RendezVous> getRendezVous(@PathVariable Long id) {
        log.debug("REST request to get RendezVous : {}", id);
        Optional<RendezVous> rendezVous = rendezVousRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(rendezVous);
    }

    /**
     * {@code DELETE  /rendez-vous/:id} : delete the "id" rendezVous.
     *
     * @param id the id of the rendezVous to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/rendez-vous/{id}")
    public ResponseEntity<Void> deleteRendezVous(@PathVariable Long id) {
        log.debug("REST request to delete RendezVous : {}", id);
        rendezVousRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
