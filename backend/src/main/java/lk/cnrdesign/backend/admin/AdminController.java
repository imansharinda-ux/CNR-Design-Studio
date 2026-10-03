package lk.cnrdesign.backend.admin;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import lk.cnrdesign.backend.admin.AdminDtos.AppointmentRow;
import lk.cnrdesign.backend.admin.AdminDtos.BlockedDayRequest;
import lk.cnrdesign.backend.admin.AdminDtos.BlockedDayRow;
import lk.cnrdesign.backend.admin.AdminDtos.ImageOrder;
import lk.cnrdesign.backend.admin.AdminDtos.RescheduleRequest;
import lk.cnrdesign.backend.admin.AdminDtos.CoverUpdate;
import lk.cnrdesign.backend.admin.AdminDtos.ImageRow;
import lk.cnrdesign.backend.admin.AdminDtos.EnquiryRow;
import lk.cnrdesign.backend.admin.AdminDtos.ProjectForm;
import lk.cnrdesign.backend.admin.AdminDtos.ProjectRow;
import lk.cnrdesign.backend.admin.AdminDtos.StatusUpdate;
import lk.cnrdesign.backend.admin.AdminDtos.Summary;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService service;
    private final ProjectImageService imageService;

    public AdminController(AdminService service, ProjectImageService imageService) {
        this.service = service;
        this.imageService = imageService;
    }

    @GetMapping("/me")
    public Map<String, String> me(Authentication authentication) {
        return Map.of("email", authentication.getName());
    }

    @GetMapping("/summary")
    public Summary summary() {
        return service.summary();
    }

    @GetMapping("/enquiries")
    public List<EnquiryRow> enquiries() {
        return service.enquiries();
    }

    @PatchMapping("/enquiries/{id}")
    public EnquiryRow updateEnquiry(@PathVariable Long id, @Valid @RequestBody StatusUpdate body) {
        return service.updateEnquiry(id, body.status());
    }

    @GetMapping("/appointments")
    public List<AppointmentRow> appointments(@RequestParam(defaultValue = "false") boolean past) {
        return service.appointments(past);
    }

    @PatchMapping("/appointments/{id}")
    public AppointmentRow updateAppointment(@PathVariable Long id, @Valid @RequestBody StatusUpdate body) {
        return service.updateAppointment(id, body.status());
    }

    @DeleteMapping("/appointments/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelAppointment(@PathVariable Long id) {
        service.cancelAppointment(id);
    }

    @GetMapping("/projects")
    public List<ProjectRow> projects() {
        return service.projects();
    }

    @PostMapping("/projects")
    @ResponseStatus(HttpStatus.CREATED)
    public ProjectRow createProject(@Valid @RequestBody ProjectForm form) {
        return service.createProject(form);
    }

    @PutMapping("/projects/{id}")
    public ProjectRow updateProject(@PathVariable Long id, @Valid @RequestBody ProjectForm form) {
        return service.updateProject(id, form);
    }

    @GetMapping("/projects/{id}/images")
    public List<ImageRow> projectImages(@PathVariable Long id) {
        return imageService.list(id);
    }

    @PostMapping(path = "/projects/{id}/images", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @ResponseStatus(HttpStatus.CREATED)
    public List<ImageRow> uploadImages(@PathVariable Long id, @RequestParam("files") List<MultipartFile> files) {
        return imageService.upload(id, files);
    }

    @DeleteMapping("/projects/{id}/images/{imageId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteImage(@PathVariable Long id, @PathVariable Long imageId) {
        imageService.delete(id, imageId);
    }

    @PutMapping("/projects/{id}/cover")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void setCover(@PathVariable Long id, @Valid @RequestBody CoverUpdate body) {
        imageService.setCover(id, body.fileName());
    }

    @PutMapping("/appointments/{id}/reschedule")
    public AppointmentRow reschedule(@PathVariable Long id, @Valid @RequestBody RescheduleRequest body) {
        return service.reschedule(id, body);
    }

    @GetMapping("/blocked-days")
    public List<BlockedDayRow> blockedDays() {
        return service.blockedDays();
    }

    @PostMapping("/blocked-days")
    @ResponseStatus(HttpStatus.CREATED)
    public BlockedDayRow blockDay(@Valid @RequestBody BlockedDayRequest body) {
        return service.blockDay(body);
    }

    @DeleteMapping("/blocked-days/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void unblockDay(@PathVariable Long id) {
        service.unblockDay(id);
    }

    @PutMapping("/projects/{id}/images/order")
    public List<ImageRow> reorderImages(@PathVariable Long id, @Valid @RequestBody ImageOrder body) {
        return imageService.reorder(id, body.ids());
    }

    @DeleteMapping("/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable Long id) {
        imageService.deleteProject(id);
    }
}
