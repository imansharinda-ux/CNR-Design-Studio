package lk.cnrdesign.backend.project;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "testimonials")
public class Testimonial {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id")
    private Project project;

    @Column(name = "client_name", nullable = false, length = 120)
    private String clientName;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String quote;

    @Column(nullable = false)
    private boolean visible = true;

    protected Testimonial() {
    }

    public Testimonial(Project project, String clientName, String quote) {
        this.project = project;
        this.clientName = clientName;
        this.quote = quote;
    }

    public Long getId() {
        return id;
    }

    public Project getProject() {
        return project;
    }

    public String getClientName() {
        return clientName;
    }

    public String getQuote() {
        return quote;
    }

    public boolean isVisible() {
        return visible;
    }

    public void setVisible(boolean visible) {
        this.visible = visible;
    }
}
