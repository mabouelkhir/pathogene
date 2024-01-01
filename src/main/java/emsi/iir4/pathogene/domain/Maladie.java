package emsi.iir4.pathogene.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;
import java.io.Serializable;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import javax.persistence.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Maladie.
 */
@Entity
@Table(name = "maladie")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Maladie implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "nom", unique = true)
    private String nom;

    @Column(name = "modele_content_type")
    private String modeleContentType;

    @Column(name = "model_file_name")
    private String modeleFileName;

    @Column(name = "image_width")
    private Long width;

    @Column(name = "image_height")
    private Long height;

    @ElementCollection
    @CollectionTable(name = "model_class_names", joinColumns = @JoinColumn(name = "maladie_id"))
    @MapKeyColumn(name = "class_number")
    @Column(name = "class_name")
    private Map<Integer, String> classNamesMapping = new HashMap<>();

    public Long getHeight() {
        return height;
    }

    public void setHeight(Long height) {
        this.height = height;
    }

    @OneToMany(mappedBy = "maladie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "visite", "maladie", "patient" }, allowSetters = true)
    private Set<Detection> detections = new HashSet<>();

    @OneToMany(mappedBy = "maladie", fetch = FetchType.EAGER)
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "classifications", "images", "patients", "maladie" }, allowSetters = true)
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private Set<Stade> stades = new HashSet<>();

    @OneToMany(mappedBy = "maladie")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "classifications", "maladie" }, allowSetters = true)
    private Set<Unclassified> unclassifieds = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Maladie id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Maladie code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return this.nom;
    }

    public Maladie nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getModeleContentType() {
        return modeleContentType;
    }

    public void setModeleContentType(String modeleContentType) {
        this.modeleContentType = modeleContentType;
    }

    public String getModeleFileName() {
        return modeleFileName;
    }

    public void setModeleFileName(String modeleFileName) {
        this.modeleFileName = modeleFileName;
    }

    public Long getWidth() {
        return width;
    }

    public void setWidth(Long imageSize) {
        this.width = imageSize;
    }

    @JsonProperty("classNamesMapping")
    public Map<Integer, String> getClassNamesMapping() {
        return classNamesMapping;
    }

    public void setClassNamesMapping(Map<Integer, String> classNamesMapping) {
        this.classNamesMapping = classNamesMapping;
    }

    public Set<Detection> getDetections() {
        return this.detections;
    }

    public void setDetections(Set<Detection> detections) {
        if (this.detections != null) {
            this.detections.forEach(i -> i.setMaladie(null));
        }
        if (detections != null) {
            detections.forEach(i -> i.setMaladie(this));
        }
        this.detections = detections;
    }

    public Maladie detections(Set<Detection> detections) {
        this.setDetections(detections);
        return this;
    }

    public Maladie addDetection(Detection detection) {
        this.detections.add(detection);
        detection.setMaladie(this);
        return this;
    }

    public Maladie removeDetection(Detection detection) {
        this.detections.remove(detection);
        detection.setMaladie(null);
        return this;
    }

    public Set<Stade> getStades() {
        return this.stades;
    }

    public void setStades(Set<Stade> stades) {
        if (this.stades != null) {
            this.stades.forEach(i -> i.setMaladie(null));
        }
        if (stades != null) {
            stades.forEach(i -> i.setMaladie(this));
        }
        this.stades = stades;
    }

    public Maladie stades(Set<Stade> stades) {
        this.setStades(stades);
        return this;
    }

    public Maladie addStade(Stade stade) {
        this.stades.add(stade);
        stade.setMaladie(this);
        return this;
    }

    public Maladie removeStade(Stade stade) {
        this.stades.remove(stade);
        stade.setMaladie(null);
        return this;
    }

    // Helper method to convert class names from Map<String, String> to Map<Integer, String>

    public Set<Unclassified> getUnclassifieds() {
        return this.unclassifieds;
    }

    public void setUnclassifieds(Set<Unclassified> unclassifieds) {
        if (this.unclassifieds != null) {
            this.unclassifieds.forEach(i -> i.setMaladie(null));
        }
        if (unclassifieds != null) {
            unclassifieds.forEach(i -> i.setMaladie(this));
        }
        this.unclassifieds = unclassifieds;
    }

    public Maladie unclassifieds(Set<Unclassified> unclassifieds) {
        this.setUnclassifieds(unclassifieds);
        return this;
    }

    public Maladie addUnclassified(Unclassified unclassified) {
        this.unclassifieds.add(unclassified);
        unclassified.setMaladie(this);
        return this;
    }

    public Maladie removeUnclassified(Unclassified unclassified) {
        this.unclassifieds.remove(unclassified);
        unclassified.setMaladie(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Maladie)) {
            return false;
        }
        return id != null && id.equals(((Maladie) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Maladie{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            "}";
    }
}
