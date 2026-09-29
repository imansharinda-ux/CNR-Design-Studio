package lk.cnrdesign.backend.enquiry;

import java.time.LocalDateTime;

public record EnquiryResponse(Long id, String name, LocalDateTime createdAt) {

    public static EnquiryResponse from(Enquiry e) {
        return new EnquiryResponse(e.getId(), e.getName(), e.getCreatedAt());
    }
}
