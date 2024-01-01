package emsi.iir4.pathogene.repository;

import emsi.iir4.pathogene.domain.Classification;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Classification entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ClassificationRepository extends JpaRepository<Classification, Long> {}
