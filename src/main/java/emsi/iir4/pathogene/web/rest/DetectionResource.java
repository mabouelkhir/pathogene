package emsi.iir4.pathogene.web.rest;

import emsi.iir4.pathogene.domain.Detection;
import emsi.iir4.pathogene.repository.DetectionRepository;
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
 * REST controller for managing {@link emsi.iir4.pathogene.domain.Detection}.
 */
@RestController
@RequestMapping("/api")
@Transactional
public class DetectionResource {

    private final Logger log = LoggerFactory.getLogger(DetectionResource.class);

    private static final String ENTITY_NAME = "detection";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DetectionRepository detectionRepository;

    private final MqController mqController;

    public DetectionResource(DetectionRepository detectionRepository, MqController mqController) {
        this.detectionRepository = detectionRepository;
        this.mqController = mqController;
    }

    /**
     * {@code POST  /detections} : Create a new detection.
     *
     * @param detection the detection to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new detection, or with status {@code 400 (Bad Request)} if the detection has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/detections")
    public ResponseEntity<Detection> createDetection(@Valid @RequestBody Detection detection) throws URISyntaxException {
        log.debug("REST request to save Detection : {}", detection);
        if (detection.getId() != null) {
            throw new BadRequestAlertException("A new detection cannot already have an ID", ENTITY_NAME, "idexists");
        }

        String oracle = mqController.send(detection.getPhoto(), detection.getMaladie().getNom());
        detection.setDescription(oracle);
        String stade = oracle.split("Confidence This Is ")[1];
        detection.setStade(stade);
        detection.setCode("DET-" + UUID.randomUUID().toString());

        Detection result = detectionRepository.save(detection);
        return ResponseEntity
            .created(new URI("/api/detections/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /detections/:id} : Updates an existing detection.
     *
     * @param id the id of the detection to save.
     * @param detection the detection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detection,
     * or with status {@code 400 (Bad Request)} if the detection is not valid,
     * or with status {@code 500 (Internal Server Error)} if the detection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/detections/{id}")
    public ResponseEntity<Detection> updateDetection(
        @PathVariable(value = "id", required = false) final Long id,
        @Valid @RequestBody Detection detection
    ) throws URISyntaxException {
        log.debug("REST request to update Detection : {}, {}", id, detection);
        if (detection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Detection result = detectionRepository.save(detection);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, detection.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /detections/:id} : Partial updates given fields of an existing detection, field will ignore if it is null
     *
     * @param id the id of the detection to save.
     * @param detection the detection to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated detection,
     * or with status {@code 400 (Bad Request)} if the detection is not valid,
     * or with status {@code 404 (Not Found)} if the detection is not found,
     * or with status {@code 500 (Internal Server Error)} if the detection couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/detections/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Detection> partialUpdateDetection(
        @PathVariable(value = "id", required = false) final Long id,
        @NotNull @RequestBody Detection detection
    ) throws URISyntaxException {
        log.debug("REST request to partial update Detection partially : {}, {}", id, detection);
        if (detection.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, detection.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!detectionRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Detection> result = detectionRepository
            .findById(detection.getId())
            .map(existingDetection -> {
                if (detection.getPhoto() != null) {
                    existingDetection.setPhoto(detection.getPhoto());
                }
                if (detection.getPhotoContentType() != null) {
                    existingDetection.setPhotoContentType(detection.getPhotoContentType());
                }
                if (detection.getCode() != null) {
                    existingDetection.setCode(detection.getCode());
                }
                if (detection.getValidation() != null) {
                    existingDetection.setValidation(detection.getValidation());
                }
                if (detection.getStade() != null) {
                    existingDetection.setStade(detection.getStade());
                }
                if (detection.getDate() != null) {
                    existingDetection.setDate(detection.getDate());
                }
                if (detection.getDescription() != null) {
                    existingDetection.setDescription(detection.getDescription());
                }

                return existingDetection;
            })
            .map(detectionRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, detection.getId().toString())
        );
    }

    /**
     * {@code GET  /detections} : get all the detections.
     *
     * @param pageable the pagination information.
     * @param filter the filter of the request.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of detections in body.
     */
    @GetMapping("/detections")
    public ResponseEntity<List<Detection>> getAllDetections(
        @org.springdoc.api.annotations.ParameterObject Pageable pageable,
        @RequestParam(required = false) String filter
    ) {
        if ("visite-is-null".equals(filter)) {
            log.debug("REST request to get all Detections where visite is null");
            return new ResponseEntity<>(
                StreamSupport
                    .stream(detectionRepository.findAll().spliterator(), false)
                    .filter(detection -> detection.getVisite() == null)
                    .collect(Collectors.toList()),
                HttpStatus.OK
            );
        }
        log.debug("REST request to get a page of Detections");
        Page<Detection> page = detectionRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    @GetMapping("/detections/patient/{id}")
    public ResponseEntity<List<Detection>> getAllDetectionsByPatient(
        @PathVariable Long id,
        @org.springdoc.api.annotations.ParameterObject Pageable pageable
    ) {
        log.debug("REST request to get a page of Detections");
        Page<Detection> page = detectionRepository.findAllByPatientId(id, pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /detections/:id} : get the "id" detection.
     *
     * @param id the id of the detection to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the detection, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/detections/{id}")
    public ResponseEntity<Detection> getDetection(@PathVariable Long id) {
        log.debug("REST request to get Detection : {}", id);
        Optional<Detection> detection = detectionRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(detection);
    }

    /**
     * {@code DELETE  /detections/:id} : delete the "id" detection.
     *
     * @param id the id of the detection to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/detections/{id}")
    public ResponseEntity<Void> deleteDetection(@PathVariable Long id) {
        log.debug("REST request to delete Detection : {}", id);
        detectionRepository.deleteById(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
