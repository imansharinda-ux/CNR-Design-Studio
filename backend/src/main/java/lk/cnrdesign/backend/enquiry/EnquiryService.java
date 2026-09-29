package lk.cnrdesign.backend.enquiry;

import lk.cnrdesign.backend.notification.AppointmentMailer;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class EnquiryService {

    private final EnquiryRepository repository;
    private final AppointmentMailer mailer;

    public EnquiryService(EnquiryRepository repository, AppointmentMailer mailer) {
        this.repository = repository;
        this.mailer = mailer;
    }

    @Transactional
    public EnquiryResponse create(EnquiryRequest request) {
        Enquiry saved = repository.save(new Enquiry(request));
        mailer.newEnquiry(saved);
        return EnquiryResponse.from(saved);
    }
}
