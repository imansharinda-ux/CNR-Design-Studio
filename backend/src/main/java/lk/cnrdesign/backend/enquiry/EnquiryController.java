package lk.cnrdesign.backend.enquiry;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import lk.cnrdesign.backend.common.SpamGuard;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/enquiries")
public class EnquiryController {

    private final EnquiryService service;
    private final SpamGuard spamGuard;

    public EnquiryController(EnquiryService service, SpamGuard spamGuard) {
        this.service = service;
        this.spamGuard = spamGuard;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public EnquiryResponse create(@Valid @RequestBody EnquiryRequest request, HttpServletRequest http) {
        spamGuard.check(http, request.website(), "enquiry");
        return service.create(request);
    }
}
