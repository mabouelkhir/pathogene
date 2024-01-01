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
 * A Secretaire.
 */
@Entity
@Table(name = "secretaire")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Secretaire implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "code", unique = true)
    private String code;

    @Column(name = "nom")
    private String nom;

    @Column(name = "num_emp")
    private String numEmp;

    @Column(name = "prenom")
    private String prenom;

    @Column(name = "admin")
    private Boolean admin;

    @Lob
    @Column(name = "photo")
    private byte[] photo;

    @Column(name = "photo_content_type")
    private String photoContentType;

    @OneToOne
    @JoinColumn(unique = true)
    private User user;

    @OneToMany(mappedBy = "secretaire")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "classifications", "rendezVous", "secretaire" }, allowSetters = true)
    private Set<Medecin> medecins = new HashSet<>();

    @OneToMany(mappedBy = "secretaire")
    @Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
    @JsonIgnoreProperties(value = { "user", "rendezVous", "detections", "secretaire", "stade" }, allowSetters = true)
    private Set<Patient> patients = new HashSet<>();

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Secretaire id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCode() {
        return this.code;
    }

    public Secretaire code(String code) {
        this.setCode(code);
        return this;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getNom() {
        return this.nom;
    }

    public Secretaire nom(String nom) {
        this.setNom(nom);
        return this;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNumEmp() {
        return this.numEmp;
    }

    public Secretaire numEmp(String numEmp) {
        this.setNumEmp(numEmp);
        return this;
    }

    public void setNumEmp(String numEmp) {
        this.numEmp = numEmp;
    }

    public String getPrenom() {
        return this.prenom;
    }

    public Secretaire prenom(String prenom) {
        this.setPrenom(prenom);
        return this;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public Boolean getAdmin() {
        return this.admin;
    }

    public Secretaire admin(Boolean admin) {
        this.setAdmin(admin);
        return this;
    }

    public void setAdmin(Boolean admin) {
        this.admin = admin;
    }

    public byte[] getPhoto() {
        return this.photo;
    }

    public Secretaire photo(byte[] photo) {
        this.setPhoto(photo);
        return this;
    }

    public void setPhoto(byte[] photo) {
        this.photo = photo;
    }

    public String getPhotoContentType() {
        return this.photoContentType;
    }

    public Secretaire photoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
        return this;
    }

    public void setPhotoContentType(String photoContentType) {
        this.photoContentType = photoContentType;
    }

    public User getUser() {
        return this.user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Secretaire user(User user) {
        this.setUser(user);
        return this;
    }

    public Set<Medecin> getMedecins() {
        return this.medecins;
    }

    public void setMedecins(Set<Medecin> medecins) {
        if (this.medecins != null) {
            this.medecins.forEach(i -> i.setSecretaire(null));
        }
        if (medecins != null) {
            medecins.forEach(i -> i.setSecretaire(this));
        }
        this.medecins = medecins;
    }

    public Secretaire medecins(Set<Medecin> medecins) {
        this.setMedecins(medecins);
        return this;
    }

    public Secretaire addMedecin(Medecin medecin) {
        this.medecins.add(medecin);
        medecin.setSecretaire(this);
        return this;
    }

    public Secretaire removeMedecin(Medecin medecin) {
        this.medecins.remove(medecin);
        medecin.setSecretaire(null);
        return this;
    }

    public Set<Patient> getPatients() {
        return this.patients;
    }

    public void setPatients(Set<Patient> patients) {
        if (this.patients != null) {
            this.patients.forEach(i -> i.setSecretaire(null));
        }
        if (patients != null) {
            patients.forEach(i -> i.setSecretaire(this));
        }
        this.patients = patients;
    }

    public Secretaire patients(Set<Patient> patients) {
        this.setPatients(patients);
        return this;
    }

    public Secretaire addPatient(Patient patient) {
        this.patients.add(patient);
        patient.setSecretaire(this);
        return this;
    }

    public Secretaire removePatient(Patient patient) {
        this.patients.remove(patient);
        patient.setSecretaire(null);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Secretaire)) {
            return false;
        }
        return id != null && id.equals(((Secretaire) o).id);
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Secretaire{" +
            "id=" + getId() +
            ", code='" + getCode() + "'" +
            ", nom='" + getNom() + "'" +
            ", numEmp='" + getNumEmp() + "'" +
            ", prenom='" + getPrenom() + "'" +
            ", admin='" + getAdmin() + "'" +
            ", photo='" + getPhoto() + "'" +
            ", photoContentType='" + getPhotoContentType() + "'" +
            "}";
    }
}
