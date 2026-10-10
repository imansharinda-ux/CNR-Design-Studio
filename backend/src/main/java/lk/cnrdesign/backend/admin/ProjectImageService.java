package lk.cnrdesign.backend.admin;

import java.awt.image.BufferedImage;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.imageio.ImageIO;
import lk.cnrdesign.backend.admin.AdminDtos.ImageRow;
import lk.cnrdesign.backend.project.Project;
import lk.cnrdesign.backend.project.ProjectImage;
import lk.cnrdesign.backend.project.ProjectImageRepository;
import lk.cnrdesign.backend.project.ProjectRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProjectImageService {

    static final String URL_PREFIX = "/uploads/projects/";
    private static final Set<String> ALLOWED = Set.of("jpg", "jpeg", "png");

    private final ProjectRepository projects;
    private final ProjectImageRepository images;
    private final Path folder;

    public ProjectImageService(
            ProjectRepository projects,
            ProjectImageRepository images,
            @Value("${app.upload-dir:uploads}") String uploadDir) {
        this.projects = projects;
        this.images = images;
        this.folder = Paths.get(uploadDir, "projects").toAbsolutePath().normalize();
    }

    @Transactional(readOnly = true)
    public List<ImageRow> list(Long projectId) {
        return images.findByProjectOrderBySortOrderAsc(project(projectId)).stream().map(ImageRow::from).toList();
    }

    @Transactional
    public List<ImageRow> upload(Long projectId, List<MultipartFile> files) {
        Project project = project(projectId);
        if (files == null || files.isEmpty()) {
            throw bad("Please choose at least one photo");
        }
        try {
            Files.createDirectories(folder);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not create the upload folder");
        }

        int order = images.findTopByProjectOrderBySortOrderDesc(project).map(ProjectImage::getSortOrder).orElse(0);
        for (MultipartFile file : files) {
            String original = file.getOriginalFilename() == null ? "photo" : file.getOriginalFilename();
            String ext = extension(original);
            if (!ALLOWED.contains(ext)) {
                throw bad(original + " is not a JPG or PNG photo");
            }
            BufferedImage picture;
            try (InputStream in = file.getInputStream()) {
                picture = ImageIO.read(in);
            } catch (IOException e) {
                picture = null;
            }
            if (picture == null) {
                throw bad(original + " could not be read as a photo");
            }
            String stored = UUID.randomUUID().toString().replace("-", "") + (ext.equals("png") ? ".png" : ".jpg");
            try {
                file.transferTo(folder.resolve(stored));
            } catch (IOException e) {
                throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Could not save " + original);
            }
            images.save(new ProjectImage(project, URL_PREFIX + stored, picture.getWidth(), picture.getHeight(), ++order));
        }
        return images.findByProjectOrderBySortOrderAsc(project).stream().map(ImageRow::from).toList();
    }

    @Transactional
    public void delete(Long projectId, Long imageId) {
        ProjectImage image = images.findById(imageId)
                .filter(i -> i.getProject().getId().equals(projectId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Photo not found"));
        if (image.getFileName().equals(image.getProject().getCoverImage())) {
            throw bad("This photo is the cover. Choose another cover photo first.");
        }
        String fileName = image.getFileName();
        images.delete(image);
        if (fileName.startsWith(URL_PREFIX)) {
            try {
                Files.deleteIfExists(folder.resolve(fileName.substring(URL_PREFIX.length())));
            } catch (IOException ignored) {
            }
        }
    }

    @Transactional
    public void setCover(Long projectId, String fileName) {
        Project project = project(projectId);
        boolean inGallery = images.findByProjectOrderBySortOrderAsc(project).stream()
                .anyMatch(i -> i.getFileName().equals(fileName));
        if (!inGallery) {
            throw bad("Choose a photo from this project's gallery");
        }
        project.setCoverImage(fileName);
    }

    @Transactional
    public List<ImageRow> reorder(Long projectId, List<Long> ids) {
        Project project = project(projectId);
        List<ProjectImage> current = images.findByProjectOrderBySortOrderAsc(project);
        if (ids == null || ids.size() != current.size()
                || !current.stream().map(ProjectImage::getId).collect(Collectors.toSet()).equals(Set.copyOf(ids))) {
            throw bad("The photo list has changed. Please reload and try again.");
        }
        Map<Long, ProjectImage> byId = current.stream().collect(Collectors.toMap(ProjectImage::getId, i -> i));
        for (int i = 0; i < ids.size(); i++) {
            byId.get(ids.get(i)).setSortOrder(i + 1);
        }
        return images.findByProjectOrderBySortOrderAsc(project).stream().map(ImageRow::from).toList();
    }

    @Transactional
    public void deleteProject(Long projectId) {
        Project project = project(projectId);
        List<ProjectImage> all = images.findByProjectOrderBySortOrderAsc(project);
        List<String> files = all.stream().map(ProjectImage::getFileName).filter(f -> f.startsWith(URL_PREFIX)).toList();
        images.deleteAll(all);
        images.flush();
        projects.delete(project);
        for (String fileName : files) {
            try {
                Files.deleteIfExists(folder.resolve(fileName.substring(URL_PREFIX.length())));
            } catch (IOException ignored) {
            }
        }
    }

    private Project project(Long id) {
        return projects.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project not found"));
    }

    private static String extension(String name) {
        int dot = name.lastIndexOf('.');
        return dot < 0 ? "" : name.substring(dot + 1).toLowerCase(Locale.ROOT);
    }

    private static ResponseStatusException bad(String message) {
        return new ResponseStatusException(HttpStatus.BAD_REQUEST, message);
    }
}
