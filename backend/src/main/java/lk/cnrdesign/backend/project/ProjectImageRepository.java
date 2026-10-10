package lk.cnrdesign.backend.project;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectImageRepository extends JpaRepository<ProjectImage, Long> {

    List<ProjectImage> findByProjectOrderBySortOrderAsc(Project project);

    Optional<ProjectImage> findTopByProjectOrderBySortOrderDesc(Project project);
}
