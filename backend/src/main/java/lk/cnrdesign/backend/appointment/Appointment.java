package lk.cnrdesign.backend.appointment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import lk.cnrdesign.backend.enquiry.Enquiry;

@Entity
@Table(
        name = "appointments",
        uniqueConstraints = @UniqueConstraint(name = "uk_appointment_slot", columnNames = {"appointment_date", "appointment_time"}))
public class Appointment {

    public enum Status {
        BOOKED, CONFIRMED, CANCELLED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "appointment_date", nullable = false)
    private LocalDate appointmentDate;

    @Column(name = "appointment_time", nullable = false)
    private LocalTime appointmentTime;

    @Column(name = "meeting_type", nullable = false, length = 30)
    private String meetingType;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(columnDefinition = "TEXT")
    private String note;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.BOOKED;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enquiry_id")
    private Enquiry enquiry;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Appointment() {
    }

    public Appointment(AppointmentRequest r) {
        this.appointmentDate = r.date();
        this.appointmentTime = r.time();
        this.meetingType = r.meetingType().trim();
        this.name = r.name().trim();
        this.phone = r.phone().trim();
        this.email = r.email().trim();
        this.note = r.note() == null || r.note().isBlank() ? null : r.note().trim();
    }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public LocalDate getAppointmentDate() {
        return appointmentDate;
    }

    public LocalTime getAppointmentTime() {
        return appointmentTime;
    }

    public String getMeetingType() {
        return meetingType;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getNote() {
        return note;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public void moveTo(LocalDate date, LocalTime time) {
        this.appointmentDate = date;
        this.appointmentTime = time;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Enquiry getEnquiry() {
        return enquiry;
    }

    public void setEnquiry(Enquiry enquiry) {
        this.enquiry = enquiry;
    }
}