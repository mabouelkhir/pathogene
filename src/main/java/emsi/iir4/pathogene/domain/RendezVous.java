package emsi.iir4.pathogene.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import java.io.Serializable;
import java.time.ZonedDateTime;
import javax.persistence.*;
import javax.validation.constraints.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

/**
 * A RendezVous.
 */
@Entity
@Table(name = "rendez_vous")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class RendezVous implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "date")
    private ZonedDateTime date;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "status")
    private String status;

    @JsonIgnoreProperties(value = { "rendezVous", "detection" }, allowSetters = true)
    @OneToOne(mappedBy = "rendezVous")
    private Visite visite;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "rendezVous", "detections", "secretaire", "stade" }, allowSetters = true)
    private Patient patient;

    @ManyToOne
    @JsonIgnoreProperties(value = { "user", "classifications", "rendezVous", "secretaire" }, allowSetters = true)
    private Medecin medecin;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public RendezVous id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ZonedDateTime getDate() {
        return this.date;
    }

    public RendezVous date(ZonedDateTime date) {
        this.setDate(date);
        return this;
    }

    public void setDate(ZonedDateTime date) {
        this.date = date;
    }

    public String getCode() {
        return this.code;
    }

    public RendezVous code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getStatus() {
        return this.status;
    }

    public RendezVous status(String status) {
        this.setStatus(status);
        return this;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Visite getVisite() {
        return this.visite;
    }

    public void setVisite(Visite visite) {
        if (this.visite != null) {
            this.visite.setRendezVous(null);
        }
        if (visite != null) {
            visite.setRendezVous(this);
        }
        this.visite = visite;
    }

    public RendezVous visite(Visite visite) {
        this.setVisite(visite);
        return this;
    }

    public Patient getPatient() {
        return this.patient;
    }

    public void setPatient(Patient patient) {
        this.patient = patient;
    }

    public RendezVous patient(Patient patient) {
        this.setPatient(patient);
        return this;
    }

    public Medecin getMedecin() {
        return this.medecin;
    }

    public void setMedecin(Medecin medecin) {
        this.medecin = medecin;
    }

    public RendezVous medecin(Medecin medecin) {
        this.setMedecin(medecin);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof RendezVous)) {
            return false;
        }
        return id != null && id.equals(((RendezVous) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "RendezVous{" +
            "id=" + getId() +
            ", date='" + getDate() + "'" +
            ", code='" + getCode() + "'" +
            ", status='" + getStatus() + "'" +
            "}";
    }
}
