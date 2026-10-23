package lk.cnrdesign.backend.notification;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import lk.cnrdesign.backend.appointment.Appointment;
import lk.cnrdesign.backend.enquiry.Enquiry;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class AppointmentMailer {

    private static final DateTimeFormatter DATE = DateTimeFormatter.ofPattern("EEEE, d MMMM yyyy", Locale.ENGLISH);
    private static final DateTimeFormatter TIME = DateTimeFormatter.ofPattern("h:mm a", Locale.ENGLISH);
    private static final String SIGNATURE = "\nChanaka Rambukwella\nCNR Design Studio\n";

    private final EmailSender email;
    private final String siteUrl;
    private final String phone;
    private final String address;
    private final String studioEmail;

    public AppointmentMailer(
            EmailSender email,
            @Value("${app.site-url:http://localhost:5173}") String siteUrl,
            @Value("${app.studio.phone:071 868 7628}") String phone,
            @Value("${app.studio.address:No. 15, Kalugala Road, Katugastota}") String address,
            @Value("${app.studio.email:${app.admin.email:rambukwella77@yahoo.com}}") String studioEmail) {
        this.email = email;
        this.siteUrl = siteUrl.endsWith("/") ? siteUrl.substring(0, siteUrl.length() - 1) : siteUrl;
        this.phone = phone;
        this.address = address;
        this.studioEmail = studioEmail;
    }

    public boolean isEnabled() {
        return email.isEnabled();
    }

    public static String reference(long id) {
        return String.format("CNR-%05d", id);
    }

    public void bookingReceived(Appointment a) {
        email.send(a.getEmail(), "We have received your appointment request",
                "Dear " + a.getName() + ",\n\n"
                        + "Thank you for booking a meeting with CNR Design Studio. We have received your request.\n\n"
                        + details(a)
                        + "Your booking is waiting for confirmation. We will email you again once it is confirmed.\n\n"
                        + "You can see or cancel your appointment here:\n" + link(a) + "\n"
                        + SIGNATURE);
        email.send(studioEmail, "New appointment request " + reference(a.getId()),
                "A new appointment has been booked on the website.\n\n"
                        + details(a)
                        + "Client: " + a.getName() + "\n"
                        + "Phone: " + a.getPhone() + "\n"
                        + "Email: " + a.getEmail() + "\n"
                        + (a.getNote() == null ? "" : "Note: " + a.getNote() + "\n")
                        + "\nConfirm it in the dashboard: " + siteUrl + "/admin\n");
    }

    public void confirmed(Appointment a) {
        String where = a.getMeetingType().equals("Studio visit")
                ? "Place: " + address + "\n\n"
                : "We will contact you at the time of the meeting.\n\n";
        email.send(a.getEmail(), "Your appointment with CNR Design Studio is confirmed",
                "Dear " + a.getName() + ",\n\n"
                        + "Your appointment with CNR Design Studio is confirmed.\n\n"
                        + details(a)
                        + where
                        + "You can see your appointment at any time here:\n" + link(a) + "\n\n"
                        + "If you need to change the time, please call " + phone + ".\n"
                        + SIGNATURE);
    }

    public void rescheduled(Appointment a, LocalDate oldDate, LocalTime oldTime) {
        email.send(a.getEmail(), "Your appointment with CNR Design Studio has a new time",
                "Dear " + a.getName() + ",\n\n"
                        + "Your appointment has been moved from " + oldDate.format(DATE) + " at " + oldTime.format(TIME)
                        + " to the new time below.\n\n"
                        + details(a)
                        + "You can see your appointment here:\n" + link(a) + "\n\n"
                        + "If the new time does not suit you, please call " + phone + ".\n"
                        + SIGNATURE);
    }

    public void cancelledByStudio(Appointment a) {
        email.send(a.getEmail(), "Your appointment with CNR Design Studio has been cancelled",
                "Dear " + a.getName() + ",\n\n"
                        + "We are sorry, but your appointment has been cancelled.\n\n"
                        + details(a)
                        + "Please book a new time here: " + siteUrl + "/book\n"
                        + "or call us on " + phone + ".\n"
                        + SIGNATURE);
    }

    public void cancelledByClient(Appointment a) {
        email.send(a.getEmail(), "Your appointment has been cancelled",
                "Dear " + a.getName() + ",\n\n"
                        + "As you asked, your appointment has been cancelled.\n\n"
                        + details(a)
                        + "You are welcome to book a new time whenever it suits you: " + siteUrl + "/book\n"
                        + SIGNATURE);
        email.send(studioEmail, "Appointment cancelled by the client " + reference(a.getId()),
                a.getName() + " cancelled their appointment.\n\n"
                        + details(a)
                        + "Phone: " + a.getPhone() + "\n"
                        + "Email: " + a.getEmail() + "\n\n"
                        + "The time is now free for other bookings.\n");
    }

    public void newEnquiry(Enquiry e) {
        email.send(studioEmail, "New project enquiry from " + e.getName(),
                "A new project enquiry has arrived on the website.\n\n"
                        + "Name: " + e.getName() + "\n"
                        + "Phone: " + e.getPhone() + "\n"
                        + "Email: " + e.getEmail() + "\n"
                        + line("About", e.getEnquiryType())
                        + line("Who", e.getRole())
                        + line("Budget", e.getBudget())
                        + line("Project address", e.getProjectAddress())
                        + line("City", e.getCity())
                        + (e.getNeededBy() == null ? "" : "Visuals needed by: " + e.getNeededBy().format(DATE) + "\n")
                        + line("Comments", e.getComments())
                        + "\nSee all enquiries in the dashboard: " + siteUrl + "/admin\n");
    }

    private String details(Appointment a) {
        return "Date: " + a.getAppointmentDate().format(DATE) + "\n"
                + "Time: " + a.getAppointmentTime().format(TIME) + "\n"
                + "Meeting: " + a.getMeetingType() + "\n"
                + "Reference: " + reference(a.getId()) + "\n\n";
    }

    private String link(Appointment a) {
        return siteUrl + "/my-appointment?ref=" + reference(a.getId())
                + "&email=" + URLEncoder.encode(a.getEmail(), StandardCharsets.UTF_8);
    }

    private static String line(String label, String value) {
        return value == null || value.isBlank() ? "" : label + ": " + value + "\n";
    }
}
