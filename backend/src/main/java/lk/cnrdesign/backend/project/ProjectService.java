package lk.cnrdesign.backend.project;

import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository repository;

    public ProjectService(ProjectRepository repository) {
        this.repository = repository;
    }

    public List<ProjectResponse> findAll(boolean featuredOnly) {
        List<Project> projects = featuredOnly
                ? repository.findByFeaturedTrueOrderBySortOrderAsc()
                : repository.findAllByOrderBySortOrderAsc();
        return projects.stream().map(ProjectResponse::from).toList();
    }

    public ProjectDetailResponse findBySlug(String slug) {
        return repository.findBySlug(slug)
                .map(ProjectDetailResponse::from)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }
}