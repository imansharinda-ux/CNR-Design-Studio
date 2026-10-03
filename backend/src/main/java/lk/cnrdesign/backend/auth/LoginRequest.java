package lk.cnrdesign.backend.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record LoginRequest(
        @NotBlank(message = "Please enter your email")
        @Email(message = "Please enter a valid email address")
        String email,

        @NotBlank(message = "Please enter your password")
        String password) {
}
