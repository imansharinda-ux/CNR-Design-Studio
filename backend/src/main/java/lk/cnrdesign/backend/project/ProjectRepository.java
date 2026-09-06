package lk.cnrdesign.backend.project;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {

    List<Project> findAllByOrderBySortOrderAsc();

    List<Project> findByFeaturedTrueOrderBySortOrderAsc();

    Optional<Project> findBySlug(String slug);

    boolean existsBySlug(String slug);

    Optional<Project> findTopByOrderBySortOrderDesc();
}
