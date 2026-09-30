package lk.cnrdesign.backend.appointment;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import java.time.LocalDate;
import java.util.List;
import lk.cnrdesign.backend.common.SpamGuard;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    private final AppointmentService service;
    private final SpamGuard spamGuard;

    public AppointmentController(AppointmentService service, SpamGuard spamGuard) {
        this.service = service;
        this.spamGuard = spamGuard;
    }

    @GetMapping("/slots")
    public SlotsResponse slots(@RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        return service.availableSlots(date);
    }

    @GetMapping("/blocked")
    public List<String> blocked() {
        return service.blockedDates();
    }

    @GetMapping("/status")
    public AppointmentStatusResponse status(@RequestParam String ref, @RequestParam String email) {
        return service.status(ref, email);
    }

    @PostMapping("/cancel")
    public AppointmentStatusResponse cancel(@Valid @RequestBody CancelRequest request, HttpServletRequest http) {
        spamGuard.check(http, null, "cancel");
        return service.cancelByClient(request.reference(), request.email());
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppointmentResponse book(@Valid @RequestBody AppointmentRequest request, HttpServletRequest http) {
        spamGuard.check(http, request.website(), "booking");
        return service.book(request);
    }
}
