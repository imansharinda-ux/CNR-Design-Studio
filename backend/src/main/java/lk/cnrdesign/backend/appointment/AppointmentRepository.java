package lk.cnrdesign.backend.appointment;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    List<Appointment> findByAppointmentDateAndStatusNot(LocalDate date, Appointment.Status status);

    boolean existsByAppointmentDateAndAppointmentTimeAndStatusNot(LocalDate date, LocalTime time, Appointment.Status status);

    List<Appointment> findByAppointmentDateGreaterThanEqualOrderByAppointmentDateAscAppointmentTimeAsc(LocalDate date);

    List<Appointment> findByAppointmentDateLessThanOrderByAppointmentDateDescAppointmentTimeDesc(LocalDate date);

    long countByAppointmentDate(LocalDate date);

    boolean existsByAppointmentDateAndAppointmentTimeAndIdNot(LocalDate date, LocalTime time, Long id);

    long countByAppointmentDateGreaterThanEqual(LocalDate date);
}
