package emsi.iir4.pathogene.repository;

import emsi.iir4.pathogene.domain.Patient;
import java.util.Optional;
import java.util.Set;
import liquibase.pro.packaged.P;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Patient entity.
 */
@SuppressWarnings("unused")
@Repository
public interface PatientRepository extends PatientRepositoryWithBagRelationships, JpaRepository<Patient, Long> {
    default Optional<Patient> findOneWithEagerRelationships(Long id) {
        return this.fetchBagRelationships(this.findById(id));
    }

    default Page<Patient> findAllWithEagerRelationships(Pageable pageable) {
        return this.fetchBagRelationships(this.findAll(pageable));
    }

    Optional<Patient> findByUserId(Long id);
    Optional<Patient> findByUserLogin(String login);
    Set<Patient> findBySecretaireId(Long id);
    //Set<Patient> findByRendezVousIds();

}
