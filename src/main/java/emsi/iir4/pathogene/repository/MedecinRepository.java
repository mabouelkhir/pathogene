package emsi.iir4.pathogene.repository;

import emsi.iir4.pathogene.domain.Medecin;
import java.util.Optional;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Medecin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MedecinRepository extends JpaRepository<Medecin, Long> {
    Optional<Medecin> findByUserId(Long id);
    Optional<Medecin> findByUserLogin(String login);
}
