package emsi.iir4.pathogene.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A Stade.
 */
@Entity
@Table(name = "stade")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Stade implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "level")
    private String level;

    @Column(name = "description")
    private String description;

    @OneToMany(mappedBy = "stade")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "medecin", "stade", "unclassified" }, allowSetters = true)
    private Set<Classification> classifications = new HashSet<>();

    @OneToMany(mappedBy = "stade")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "stade" }, allowSetters = true)
    private Set<Image> images = new HashSet<>();

    @OneToMany(mappedBy = "stade")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "rendezVous", "detections", "secretaire", "stade" }, allowSetters = true)
    private Set<Patient> patients = new HashSet<>();

    @ManyToOne
    @JsonIgnoreProperties(value = { "detections", "stades", "unclassifieds" }, allowSetters = true)
    private Maladie maladie;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Stade id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Stade code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getLevel() {
        return this.level;
    }

    public Stade level(String level) {
        this.setLevel(level);
        return this;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getDescription() {
        return this.description;
    }

    public Stade description(String description) {
        this.setDescription(description);
        return this;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Set<Classification> getClassifications() {
        return this.classifications;
    }

    public void setClassifications(Set<Classification> classifications) {
        if (this.classifications != null) {
            this.classifications.forEach(i -> i.setStade(null));
        }
        if (classifications != null) {
            classifications.forEach(i -> i.setStade(this));
        }
        this.classifications = classifications;
    }

    public Stade classifications(Set<Classification> classifications) {
        this.setClassifications(classifications);
        return this;
    }

    public Stade addClassification(Classification classification) {
        this.classifications.add(classification);
        classification.setStade(this);
        return this;
    }

    public Stade removeClassification(Classification classification) {
        this.classifications.remove(classification);
        classification.setStade(null);
        return this;
    }

    public Set<Image> getImages() {
        return this.images;
    }

    public void setImages(Set<Image> images) {
        if (this.images != null) {
            this.images.forEach(i -> i.setStade(null));
        }
        if (images != null) {
            images.forEach(i -> i.setStade(this));
        }
        this.images = images;
    }

    public Stade images(Set<Image> images) {
        this.setImages(images);
        return this;
    }

    public Stade addImage(Image image) {
        this.images.add(image);
        image.setStade(this);
        return this;
    }

    public Stade removeImage(Image image) {
        this.images.remove(image);
        image.setStade(null);
        return this;
    }

    public Set<Patient> getPatients() {
        return this.patients;
    }

    public void setPatients(Set<Patient> patients) {
        if (this.patients != null) {
            this.patients.forEach(i -> i.setStade(null));
        }
        if (patients != null) {
            patients.forEach(i -> i.setStade(this));
        }
        this.patients = patients;
    }

    public Stade patients(Set<Patient> patients) {
        this.setPatients(patients);
        return this;
    }

    public Stade addPatient(Patient patient) {
        this.patients.add(patient);
        patient.setStade(this);
        return this;
    }

    public Stade removePatient(Patient patient) {
        this.patients.remove(patient);
        patient.setStade(null);
        return this;
    }

    public Maladie getMaladie() {
        return this.maladie;
    }

    public void setMaladie(Maladie maladie) {
        this.maladie = maladie;
    }

    public Stade maladie(Maladie maladie) {
        this.setMaladie(maladie);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Stade)) {
            return false;
        }
        return id != null && id.equals(((Stade) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Stade{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", level='" + getLevel() + "'" +
            ", description='" + getDescription() + "'" +
            "}";
    }
}
