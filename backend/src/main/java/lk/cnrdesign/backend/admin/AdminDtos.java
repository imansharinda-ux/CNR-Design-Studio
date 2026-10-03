package lk.cnrdesign.backend.admin;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import lk.cnrdesign.backend.appointment.Appointment;
import lk.cnrdesign.backend.appointment.BlockedDay;
import lk.cnrdesign.backend.enquiry.Enquiry;
import lk.cnrdesign.backend.project.Project;
import lk.cnrdesign.backend.project.ProjectImage;

public final class AdminDtos {

    private AdminDtos() {
    }

    public record Summary(
            long newEnquiries,
            long totalEnquiries,
            long todaysAppointments,
            long upcomingAppointments,
            long projects,
            boolean emailEnabled) {
    }

    public record StatusUpdate(@NotBlank String status) {
    }

    public record EnquiryRow(
            Long id,
            String name,
            String phone,
            String email,
            String projectAddress,
            String city,
            String postalCode,
            String enquiryType,
            String role,
            String budget,
            String neededBy,
            String comments,
            String status,
            String createdAt) {

        static EnquiryRow from(Enquiry e) {
            return new EnquiryRow(
                    e.getId(),
                    e.getName(),
                    e.getPhone(),
                    e.getEmail(),
                    e.getProjectAddress(),
                    e.getCity(),
                    e.getPostalCode(),
                    e.getEnquiryType(),
                    e.getRole(),
                    e.getBudget(),
                    e.getNeededBy() == null ? null : e.getNeededBy().toString(),
                    e.getComments(),
                    e.getStatus().name(),
                    e.getCreatedAt().toString());
        }
    }

    public record AppointmentRow(
            Long id,
            String date,
            String time,
            String meetingType,
            String name,
            String phone,
            String email,
            String note,
            String status) {

        static AppointmentRow from(Appointment a) {
            return new AppointmentRow(
                    a.getId(),
                    a.getAppointmentDate().toString(),
                    a.getAppointmentTime().toString().substring(0, 5),
                    a.getMeetingType(),
                    a.getName(),
                    a.getPhone(),
                    a.getEmail(),
                    a.getNote(),
                    a.getStatus().name());
        }
    }

    public record ProjectRow(
            Long id,
            String slug,
            String name,
            String type,
            String location,
            String coverImage,
            String description,
            boolean featured,
            int sortOrder,
            int images) {

        static ProjectRow from(Project p) {
            return new ProjectRow(
                    p.getId(),
                    p.getSlug(),
                    p.getName(),
                    p.getType(),
                    p.getLocation(),
                    p.getCoverImage(),
                    p.getDescription(),
                    p.isFeatured(),
                    p.getSortOrder(),
                    p.getImages().size());
        }
    }

    public record ProjectForm(
            @NotBlank(message = "Please enter a name")
            @Size(max = 120, message = "Name is too long")
            String name,

            @NotBlank(message = "Please choose a type")
            @Size(max = 40)
            String type,

            @NotBlank(message = "Please enter a location")
            @Size(max = 120, message = "Location is too long")
            String location,

            @NotBlank(message = "Please enter the cover image name")
            @Pattern(regexp = "^[a-zA-Z0-9_/.-]{1,60}$", message = "Use the image file name without .jpg, for example sv10")
            String coverImage,

            @Size(max = 4000, message = "Description is too long")
            String description,

            boolean featured) {
    }

    public record ImageRow(Long id, String fileName, int width, int height) {

        static ImageRow from(ProjectImage image) {
            return new ImageRow(image.getId(), image.getFileName(), image.getWidth(), image.getHeight());
        }
    }

    public record CoverUpdate(@NotBlank String fileName) {
    }

    public record RescheduleRequest(
            @NotNull(message = "Please choose a date") LocalDate date,
            @NotNull(message = "Please choose a time") LocalTime time) {
    }

    public record BlockedDayRequest(
            @NotNull(message = "Please choose a date") LocalDate date,
            @Size(max = 120, message = "Reason is too long") String reason) {
    }

    public record BlockedDayRow(Long id, String date, String reason, long appointments) {

        static BlockedDayRow from(BlockedDay day, long appointments) {
            return new BlockedDayRow(day.getId(), day.getDay().toString(), day.getReason(), appointments);
        }
    }

    public record ImageOrder(@NotEmpty List<Long> ids) {
    }
}
