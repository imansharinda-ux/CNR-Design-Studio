package lk.cnrdesign.backend.project;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OrderBy;
import jakarta.persistence.Table;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 80)
    private String slug;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 40)
    private String type;

    @Column(nullable = false, length = 120)
    private String location;

    @Column(name = "cover_image", nullable = false, length = 60)
    private String coverImage;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private boolean featured;

    @Column(name = "sort_order", nullable = false)
    private int sortOrder;

    @OneToMany(mappedBy = "project")
    @OrderBy("sortOrder ASC")
    private List<ProjectImage> images = new ArrayList<>();

    protected Project() {
    }

    public Project(String slug, int sortOrder) {
        this.slug = slug;
        this.sortOrder = sortOrder;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }

    public void update(String name, String type, String location, String coverImage, String description, boolean featured) {
        this.name = name;
        this.type = type;
        this.location = location;
        this.coverImage = coverImage;
        this.description = description;
        this.featured = featured;
    }

    public Long getId() {
        return id;
    }

    public String getSlug() {
        return slug;
    }

    public String getName() {
        return name;
    }

    public String getType() {
        return type;
    }

    public String getLocation() {
        return location;
    }

    public String getCoverImage() {
        return coverImage;
    }

    public String getDescription() {
        return description;
    }

    public boolean isFeatured() {
        return featured;
    }

    public int getSortOrder() {
        return sortOrder;
    }

    public List<ProjectImage> getImages() {
        return images;
    }
}
