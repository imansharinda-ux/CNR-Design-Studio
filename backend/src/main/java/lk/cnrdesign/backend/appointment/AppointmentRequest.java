package lk.cnrdesign.backend.appointment;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentRequest(
        @NotNull(message = "Please choose a date")
        @FutureOrPresent(message = "Please choose a date from today onwards")
        LocalDate date,

        @NotNull(message = "Please choose a time")
        LocalTime time,

        @NotBlank(message = "Please choose a meeting type")
        @Pattern(regexp = "Studio visit|Phone call|Online meeting", message = "Please choose a meeting type")
        String meetingType,

        @NotBlank(message = "Please enter your name")
        @Size(max = 120, message = "Name is too long")
        String name,

        @NotBlank(message = "Please enter your phone number")
        @Pattern(regexp = "^[+0-9 ()-]{9,20}$", message = "Please enter a valid phone number")
        String phone,

        @NotBlank(message = "Please enter your email address")
        @Email(message = "Please enter a valid email address")
        @Size(max = 160, message = "Email is too long")
        String email,

        @Size(max = 1000, message = "Note is too long")
        String note,

        @Size(max = 200)
        String website,

        Long enquiryId) {
}
