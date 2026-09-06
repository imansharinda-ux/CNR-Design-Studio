package lk.cnrdesign.backend.project;

import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService service;

    public ProjectController(ProjectService service) {
        this.service = service;
    }

    @GetMapping
    public List<ProjectResponse> list(@RequestParam(defaultValue = "false") boolean featured) {
        return service.findAll(featured);
    }

        @GetMapping("/{slug}")
    public ProjectDetailResponse get(@PathVariable String slug) {
        return service.findBySlug(slug);
    }
}