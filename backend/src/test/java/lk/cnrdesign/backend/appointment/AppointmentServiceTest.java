package lk.cnrdesign.backend.appointment;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import lk.cnrdesign.backend.enquiry.EnquiryRepository;
import lk.cnrdesign.backend.notification.AppointmentMailer;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

class AppointmentServiceTest {

    private AppointmentRepository repository;
    private BlockedDayRepository blockedDays;
    private AppointmentMailer mailer;
    private AppointmentService service;

    @BeforeEach
    void setUp() {
        repository = mock(AppointmentRepository.class);
        blockedDays = mock(BlockedDayRepository.class);
        mailer = mock(AppointmentMailer.class);
        service = new AppointmentService(repository, blockedDays, mailer, mock(EnquiryRepository.class));
    }

    private static LocalDate nextWorkingDay() {
        LocalDate day = LocalDate.now(AppointmentService.ZONE).plusDays(7);
        return day.getDayOfWeek() == DayOfWeek.SUNDAY ? day.plusDays(1) : day;
    }

    private static LocalDate nextSunday() {
        LocalDate day = LocalDate.now(AppointmentService.ZONE).plusDays(1);
        while (day.getDayOfWeek() != DayOfWeek.SUNDAY) {
            day = day.plusDays(1);
        }
        return day;
    }

    private static AppointmentRequest request(LocalDate date, LocalTime time) {
        return new AppointmentRequest(date, time, "Studio visit", "Nimal Perera", "071 234 5678", "nimal@example.com", null, null, null);
    }

    private static ResponseStatusException statusOf(Throwable e) {
        return (ResponseStatusException) e;
    }

    @Test
    void booksAFreeTimeAndSendsTheReceivedEmail() {
        LocalDate day = nextWorkingDay();
        when(repository.saveAndFlush(any(Appointment.class))).thenAnswer(call -> call.getArgument(0));

        AppointmentResponse response = service.book(request(day, LocalTime.of(10, 30)));

        assertThat(response.date()).isEqualTo(day.toString());
        assertThat(response.time()).isEqualTo("10:30");
        verify(mailer).bookingReceived(any(Appointment.class));
    }

    @Test
    void refusesATimeThatIsAlreadyBooked() {
        LocalDate day = nextWorkingDay();
        when(repository.existsByAppointmentDateAndAppointmentTimeAndStatusNot(day, LocalTime.of(9, 0), Appointment.Status.CANCELLED))
                .thenReturn(true);

        assertThatThrownBy(() -> service.book(request(day, LocalTime.of(9, 0))))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(statusOf(e).getStatusCode().value()).isEqualTo(409));
        verify(repository, never()).saveAndFlush(any());
    }

    @Test
    void refusesSundays() {
        assertThatThrownBy(() -> service.book(request(nextSunday(), LocalTime.of(9, 0))))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(statusOf(e).getStatusCode().value()).isEqualTo(400));
    }

    @Test
    void refusesDaysTheStudioHasBlocked() {
        LocalDate day = nextWorkingDay();
        when(blockedDays.existsByDay(day)).thenReturn(true);

        assertThatThrownBy(() -> service.book(request(day, LocalTime.of(9, 0))))
                .isInstanceOf(ResponseStatusException.class);
        assertThat(service.availableSlots(day).slots()).isEmpty();
    }

    @Test
    void refusesTimesThatAreNotSlots() {
        assertThatThrownBy(() -> service.book(request(nextWorkingDay(), LocalTime.of(11, 0))))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void freeSlotsLeaveOutBookedTimes() {
        LocalDate day = nextWorkingDay();
        Appointment booked = new Appointment(request(day, LocalTime.of(10, 30)));
        when(repository.findByAppointmentDateAndStatusNot(day, Appointment.Status.CANCELLED)).thenReturn(List.of(booked));

        assertThat(service.availableSlots(day).slots()).containsExactly("09:00", "14:00", "15:30");
    }

    @Test
    void statusNeedsTheMatchingEmail() {
        Appointment appointment = new Appointment(request(nextWorkingDay(), LocalTime.of(9, 0)));
        when(repository.findById(7L)).thenReturn(Optional.of(appointment));

        assertThatThrownBy(() -> service.status("CNR-00007", "someone@else.com"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(statusOf(e).getStatusCode().value()).isEqualTo(404));
    }

    @Test
    void clientCanCancelAnUpcomingAppointment() {
        Appointment appointment = new Appointment(request(nextWorkingDay(), LocalTime.of(14, 0)));
        ReflectionTestUtils.setField(appointment, "id", 7L);
        when(repository.findById(7L)).thenReturn(Optional.of(appointment));

        AppointmentStatusResponse result = service.cancelByClient("CNR-00007", "NIMAL@example.com");

        assertThat(result.status()).isEqualTo("CANCELLED");
        verify(mailer).cancelledByClient(appointment);
        verify(repository).delete(appointment);
    }
}
