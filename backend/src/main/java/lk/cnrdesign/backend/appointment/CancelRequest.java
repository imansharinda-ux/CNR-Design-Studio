package lk.cnrdesign.backend.appointment;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record CancelRequest(
        @NotBlank(message = "Please enter your booking reference")
        String reference,

        @NotBlank(message = "Please enter your email address")
        @Email(message = "Please enter a valid email address")
        String email) {
}
