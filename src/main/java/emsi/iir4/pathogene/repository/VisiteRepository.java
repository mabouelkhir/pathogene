package emsi.iir4.pathogene.repository;

import emsi.iir4.pathogene.domain.Visite;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Visite entity.
 */
@SuppressWarnings("unused")
@Repository
public interface VisiteRepository extends JpaRepository<Visite, Long> {
    Page<Visite> findByRendezVousPatientId(Long id, Pageable pageable);
    Page<Visite> findByRendezVousMedecinId(Long id, Pageable pageable);
}
