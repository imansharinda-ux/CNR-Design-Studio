package lk.cnrdesign.backend.enquiry;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public record EnquiryRequest(
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

        @Size(max = 200, message = "Address is too long")
        String projectAddress,

        @Size(max = 80, message = "City is too long")
        String city,

        @Size(max = 20, message = "Postal code is too long")
        String postalCode,

        @Size(max = 60)
        String enquiryType,

        @Size(max = 60)
        String role,

        @Size(max = 60)
        String budget,

        @FutureOrPresent(message = "Please choose a date from today onwards")
        LocalDate neededBy,

        @Size(max = 2000, message = "Comments are too long")
        String comments,

        @Size(max = 200)
        String website) {
}
