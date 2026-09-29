package lk.cnrdesign.backend.enquiry;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryRepository extends JpaRepository<Enquiry, Long> {

    List<Enquiry> findAllByOrderByCreatedAtDesc();

    long countByStatus(Enquiry.Status status);
}
