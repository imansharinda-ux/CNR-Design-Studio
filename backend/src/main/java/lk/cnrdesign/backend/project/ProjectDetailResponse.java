package lk.cnrdesign.backend.project;

import java.util.List;

public record ProjectDetailResponse(
        Long id,
        String slug,
        String name,
        String type,
        String location,
        String coverImage,
        String description,
        boolean featured,
        List<ImageResponse> images) {

    public record ImageResponse(String fileName, int width, int height) {

        static ImageResponse from(ProjectImage image) {
            return new ImageResponse(image.getFileName(), image.getWidth(), image.getHeight());
        }
    }

    public static ProjectDetailResponse from(Project p) {
        return new ProjectDetailResponse(
                p.getId(),
                p.getSlug(),
                p.getName(),
                p.getType(),
                p.getLocation(),
                p.getCoverImage(),
                p.getDescription(),
                p.isFeatured(),
                p.getImages().stream().map(ImageResponse::from).toList());
    }
}