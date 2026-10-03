package lk.cnrdesign.backend.admin;

import java.text.Normalizer;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.List;
import java.util.Locale;
import java.time.LocalTime;
import lk.cnrdesign.backend.admin.AdminDtos.AppointmentRow;
import lk.cnrdesign.backend.admin.AdminDtos.BlockedDayRequest;
import lk.cnrdesign.backend.admin.AdminDtos.BlockedDayRow;
import lk.cnrdesign.backend.admin.AdminDtos.RescheduleRequest;
import lk.cnrdesign.backend.admin.AdminDtos.EnquiryRow;
import lk.cnrdesign.backend.admin.AdminDtos.ProjectForm;
import lk.cnrdesign.backend.admin.AdminDtos.ProjectRow;
import lk.cnrdesign.backend.admin.AdminDtos.Summary;
import lk.cnrdesign.backend.appointment.Appointment;
import lk.cnrdesign.backend.appointment.AppointmentRepository;
import lk.cnrdesign.backend.appointment.AppointmentService;
import lk.cnrdesign.backend.appointment.BlockedDay;
import lk.cnrdesign.backend.appointment.BlockedDayRepository;
import lk.cnrdesign.backend.enquiry.Enquiry;
import lk.cnrdesign.backend.enquiry.EnquiryRepository;
import lk.cnrdesign.backend.notification.AppointmentMailer;
import lk.cnrdesign.backend.project.Project;
import lk.cnrdesign.backend.project.ProjectRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class AdminService {

    private static final ZoneId ZONE = ZoneId.of("Asia/Colombo");

    private final EnquiryRepository enquiries;
    private final AppointmentRepository appointments;
    private final ProjectRepository projects;
    private final AppointmentMailer mailer;
    private final AppointmentService appointmentService;
    private final BlockedDayRepository blockedDays;

    public AdminService(
            EnquiryRepository enquiries,
            AppointmentRepository appointments,
            ProjectRepository projects,
            AppointmentMailer mailer,
            AppointmentService appointmentService,
            BlockedDayRepository blockedDays) {
        this.enquiries = enquiries;
        this.appointments = appointments;
        this.projects = projects;
        this.mailer = mailer;
        this.appointmentService = appointmentService;
        this.blockedDays = blockedDays;
    }

    public Summary summary() {
        LocalDate today = LocalDate.now(ZONE);
        return new Summary(
                enquiries.countByStatus(Enquiry.Status.NEW),
                enquiries.count(),
                appointments.countByAppointmentDate(today),
                appointments.countByAppointmentDateGreaterThanEqual(today),
                projects.count(),
                mailer.isEnabled());
    }

    public List<EnquiryRow> enquiries() {
        return enquiries.findAllByOrderByCreatedAtDesc().stream().map(EnquiryRow::from).toList();
    }

    @Transactional
    public EnquiryRow updateEnquiry(Long id, String status) {
        Enquiry enquiry = enquiries.findById(id).orElseThrow(() -> notFound("Enquiry"));
        enquiry.setStatus(parse(Enquiry.Status.class, status));
        return EnquiryRow.from(enquiry);
    }

    public List<AppointmentRow> appointments(boolean past) {
        LocalDate today = LocalDate.now(ZONE);
        List<Appointment> list = past
                ? appointments.findByAppointmentDateLessThanOrderByAppointmentDateDescAppointmentTimeDesc(today)
                : appointments.findByAppointmentDateGreaterThanEqualOrderByAppointmentDateAscAppointmentTimeAsc(today);
        return list.stream().map(AppointmentRow::from).toList();
    }

    @Transactional
    public AppointmentRow updateAppointment(Long id, String status) {
        Appointment appointment = appointments.findById(id).orElseThrow(() -> notFound("Appointment"));
        Appointment.Status next = parse(Appointment.Status.class, status);
        if (next == Appointment.Status.CANCELLED) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Use cancel to remove an appointment");
        }
        boolean newlyConfirmed = next == Appointment.Status.CONFIRMED && appointment.getStatus() != Appointment.Status.CONFIRMED;
        appointment.setStatus(next);
        if (newlyConfirmed) {
            mailer.confirmed(appointment);
        }
        return AppointmentRow.from(appointment);
    }

    @Transactional
    public void cancelAppointment(Long id) {
        Appointment appointment = appointments.findById(id).orElseThrow(() -> notFound("Appointment"));
        mailer.cancelledByStudio(appointment);
        appointments.delete(appointment);
    }

    @Transactional
    public AppointmentRow reschedule(Long id, RescheduleRequest request) {
        Appointment appointment = appointments.findById(id).orElseThrow(() -> notFound("Appointment"));
        LocalDate oldDate = appointment.getAppointmentDate();
        LocalTime oldTime = appointment.getAppointmentTime();
        if (oldDate.equals(request.date()) && oldTime.equals(request.time())) {
            return AppointmentRow.from(appointment);
        }
        appointmentService.assertFree(request.date(), request.time(), appointment.getId());
        appointment.moveTo(request.date(), request.time());
        appointments.flush();
        mailer.rescheduled(appointment, oldDate, oldTime);
        return AppointmentRow.from(appointment);
    }

    public List<BlockedDayRow> blockedDays() {
        LocalDate today = LocalDate.now(ZONE);
        return blockedDays.findByDayGreaterThanEqualOrderByDayAsc(today).stream()
                .map(d -> BlockedDayRow.from(d, appointments.countByAppointmentDate(d.getDay())))
                .toList();
    }

    @Transactional
    public BlockedDayRow blockDay(BlockedDayRequest request) {
        LocalDate today = LocalDate.now(ZONE);
        if (request.date().isBefore(today)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Please choose today or a later date");
        }
        if (blockedDays.existsByDay(request.date())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "That day is already blocked");
        }
        String reason = request.reason() == null || request.reason().isBlank() ? null : request.reason().trim();
        BlockedDay saved = blockedDays.save(new BlockedDay(request.date(), reason));
        return BlockedDayRow.from(saved, appointments.countByAppointmentDate(saved.getDay()));
    }

    @Transactional
    public void unblockDay(Long id) {
        blockedDays.delete(blockedDays.findById(id).orElseThrow(() -> notFound("Blocked day")));
    }

    public List<ProjectRow> projects() {
        return projects.findAllByOrderBySortOrderAsc().stream().map(ProjectRow::from).toList();
    }

    @Transactional
    public ProjectRow createProject(ProjectForm form) {
        String base = slugify(form.name());
        String slug = base;
        int n = 2;
        while (projects.existsBySlug(slug)) {
            slug = base + "-" + n++;
        }
        int nextOrder = projects.findTopByOrderBySortOrderDesc().map(Project::getSortOrder).orElse(0) + 1;
        Project project = new Project(slug, nextOrder);
        apply(project, form);
        return ProjectRow.from(projects.save(project));
    }

    @Transactional
    public ProjectRow updateProject(Long id, ProjectForm form) {
        Project project = projects.findById(id).orElseThrow(() -> notFound("Project"));
        apply(project, form);
        return ProjectRow.from(project);
    }

    private static void apply(Project project, ProjectForm form) {
        String description = form.description() == null || form.description().isBlank() ? null : form.description().trim();
        project.update(
                form.name().trim(),
                form.type().trim(),
                form.location().trim(),
                form.coverImage().trim(),
                description,
                form.featured());
    }

    private static String slugify(String text) {
        String plain = Normalizer.normalize(text, Normalizer.Form.NFD).replaceAll("\\p{M}", "");
        String slug = plain.toLowerCase(Locale.ROOT).replaceAll("[^a-z0-9]+", "-").replaceAll("(^-|-$)", "");
        return slug.isEmpty() ? "project" : slug;
    }

    private static <E extends Enum<E>> E parse(Class<E> type, String value) {
        try {
            return Enum.valueOf(type, value.trim().toUpperCase(Locale.ROOT));
        } catch (IllegalArgumentException | NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Unknown status");
        }
    }

    private static ResponseStatusException notFound(String what) {
        return new ResponseStatusException(HttpStatus.NOT_FOUND, what + " not found");
    }
}
