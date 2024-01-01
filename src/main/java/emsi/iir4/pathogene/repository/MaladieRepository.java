package emsi.iir4.pathogene.repository;

import emsi.iir4.pathogene.domain.Maladie;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Maladie entity.
 */
@SuppressWarnings("unused")
@Repository
public interface MaladieRepository extends JpaRepository<Maladie, Long> {}
