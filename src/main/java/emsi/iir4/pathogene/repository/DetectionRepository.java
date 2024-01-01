package emsi.iir4.pathogene.repository;

import emsi.iir4.pathogene.domain.Detection;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Detection entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DetectionRepository extends JpaRepository<Detection, Long> {
    Page<Detection> findAllByPatientId(Long id, Pageable pageable);

    List<Detection> findAllByPatient_UserId(Long id);
}
