package lk.cnrdesign.backend.appointment;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import lk.cnrdesign.backend.enquiry.EnquiryRepository;
import lk.cnrdesign.backend.notification.AppointmentMailer;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AppointmentService {

    static final DateTimeFormatter TIME_FORMAT = DateTimeFormatter.ofPattern("HH:mm");
    static final ZoneId ZONE = ZoneId.of("Asia/Colombo");
    static final int MAX_DAYS_AHEAD = 60;
    static final List<LocalTime> SLOTS = List.of(
            LocalTime.of(9, 0),
            LocalTime.of(10, 30),
            LocalTime.of(14, 0),
            LocalTime.of(15, 30));

    private final AppointmentRepository repository;
    private final BlockedDayRepository blockedDays;
    private final AppointmentMailer mailer;
    private final EnquiryRepository enquiries;

    public AppointmentService(AppointmentRepository repository, BlockedDayRepository blockedDays, AppointmentMailer mailer, EnquiryRepository enquiries) {
        this.repository = repository;
        this.blockedDays = blockedDays;
        this.mailer = mailer;
        this.enquiries = enquiries;
    }

    @Transactional(readOnly = true)
    public SlotsResponse availableSlots(LocalDate date) {
        if (!isBookableDay(date)) {
            return new SlotsResponse(date.toString(), List.of());
        }
        Set<LocalTime> taken = repository.findByAppointmentDateAndStatusNot(date, Appointment.Status.CANCELLED).stream()
                .map(Appointment::getAppointmentTime)
                .collect(Collectors.toSet());
        LocalDateTime now = LocalDateTime.now(ZONE);
        List<String> free = SLOTS.stream()
                .filter(slot -> !taken.contains(slot))
                .filter(slot -> date.atTime(slot).isAfter(now))
                .map(slot -> slot.format(TIME_FORMAT))
                .toList();
        return new SlotsResponse(date.toString(), free);
    }

    @Transactional
    public AppointmentResponse book(AppointmentRequest request) {
        LocalDate date = request.date();
        LocalTime time = request.time();
        if (!isBookableDay(date) || !SLOTS.contains(time) || !date.atTime(time).isAfter(LocalDateTime.now(ZONE))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That date and time cannot be booked");
        }
        if (repository.existsByAppointmentDateAndAppointmentTimeAndStatusNot(date, time, Appointment.Status.CANCELLED)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Sorry, that time has just been booked. Please choose another time.");
        }
        try {
            Appointment appointment = new Appointment(request);
            if (request.enquiryId() != null) {
                appointment.setEnquiry(enquiries.findById(request.enquiryId())
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "That enquiry could not be found")));
            }
            Appointment saved = repository.saveAndFlush(appointment);
            mailer.bookingReceived(saved);
            return AppointmentResponse.from(saved);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Sorry, that time has just been booked. Please choose another time.");
        }
    }

    @Transactional(readOnly = true)
    public AppointmentStatusResponse status(String reference, String email) {
        return AppointmentStatusResponse.from(find(reference, email));
    }

    @Transactional
    public AppointmentStatusResponse cancelByClient(String reference, String email) {
        Appointment appointment = find(reference, email);
        if (!appointment.getAppointmentDate().atTime(appointment.getAppointmentTime()).isAfter(LocalDateTime.now(ZONE))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "This appointment has already passed.");
        }
        AppointmentStatusResponse current = AppointmentStatusResponse.from(appointment);
        mailer.cancelledByClient(appointment);
        repository.delete(appointment);
        return new AppointmentStatusResponse(
                current.reference(), current.date(), current.time(), current.meetingType(), current.name(), "CANCELLED");
    }

    private Appointment find(String reference, String email) {
        String digits = reference == null ? "" : reference.replaceAll("[^0-9]", "");
        if (digits.isEmpty() || digits.length() > 12 || email == null || email.isBlank()) {
            throw notFound();
        }
        return repository.findById(Long.parseLong(digits))
                .filter(a -> a.getEmail().equalsIgnoreCase(email.trim()))
                .orElseThrow(AppointmentService::notFound);
    }

    @Transactional(readOnly = true)
    public List<String> blockedDates() {
        LocalDate today = LocalDate.now(ZONE);
        return blockedDays.findByDayBetweenOrderByDayAsc(today, today.plusDays(MAX_DAYS_AHEAD)).stream()
                .map(b -> b.getDay().toString())
                .toList();
    }

    public void assertFree(LocalDate date, LocalTime time, Long ignoreId) {
        if (!isBookableDay(date) || !SLOTS.contains(time) || !date.atTime(time).isAfter(LocalDateTime.now(ZONE))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "That date and time cannot be booked");
        }
        if (repository.existsByAppointmentDateAndAppointmentTimeAndIdNot(date, time, ignoreId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That time is already booked. Please choose another time.");
        }
    }

    private static ResponseStatusException notFound() {
        return new ResponseStatusException(HttpStatus.NOT_FOUND,
                "We could not find an appointment with that reference and email.");
    }

    private boolean isBookableDay(LocalDate date) {
        LocalDate today = LocalDate.now(ZONE);
        return date.getDayOfWeek() != DayOfWeek.SUNDAY
                && !date.isBefore(today)
                && !date.isAfter(today.plusDays(MAX_DAYS_AHEAD))
                && !blockedDays.existsByDay(date);
    }
}
