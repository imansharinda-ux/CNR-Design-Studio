package lk.cnrdesign.backend.project;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TestimonialRepository extends JpaRepository<Testimonial, Long> {

    List<Testimonial> findByVisibleTrueOrderByIdAsc();

    List<Testimonial> findByProjectIdOrderByIdAsc(Long projectId);
}
