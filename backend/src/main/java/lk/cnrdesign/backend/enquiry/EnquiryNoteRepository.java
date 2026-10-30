package lk.cnrdesign.backend.enquiry;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EnquiryNoteRepository extends JpaRepository<EnquiryNote, Long> {

    List<EnquiryNote> findByEnquiryIdOrderByCreatedAtAsc(Long enquiryId);
}
