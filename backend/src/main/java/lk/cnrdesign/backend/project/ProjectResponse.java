package lk.cnrdesign.backend.project;

public record ProjectResponse(
        Long id,
        String slug,
        String name,
        String type,
        String location,
        String coverImage,
        String description,
        boolean featured) {

    public static ProjectResponse from(Project p) {
        return new ProjectResponse(
                p.getId(),
                p.getSlug(),
                p.getName(),
                p.getType(),
                p.getLocation(),
                p.getCoverImage(),
                p.getDescription(),
                p.isFeatured());
    }
}