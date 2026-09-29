package lk.cnrdesign.backend.enquiry;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "enquiries")
public class Enquiry {

    public enum Status {
        NEW, CONTACTED, CLOSED
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 30)
    private String phone;

    @Column(nullable = false, length = 160)
    private String email;

    @Column(name = "project_address", length = 200)
    private String projectAddress;

    @Column(length = 80)
    private String city;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "enquiry_type", length = 60)
    private String enquiryType;

    @Column(length = 60)
    private String role;

    @Column(length = 60)
    private String budget;

    @Column(name = "needed_by")
    private LocalDate neededBy;

    @Column(columnDefinition = "TEXT")
    private String comments;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private Status status = Status.NEW;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    protected Enquiry() {
    }

    public Enquiry(EnquiryRequest r) {
        this.name = r.name().trim();
        this.phone = r.phone().trim();
        this.email = r.email().trim();
        this.projectAddress = blankToNull(r.projectAddress());
        this.city = blankToNull(r.city());
        this.postalCode = blankToNull(r.postalCode());
        this.enquiryType = blankToNull(r.enquiryType());
        this.role = blankToNull(r.role());
        this.budget = blankToNull(r.budget());
        this.neededBy = r.neededBy();
        this.comments = blankToNull(r.comments());
    }

    private static String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    @PrePersist
    void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getEmail() {
        return email;
    }

    public String getProjectAddress() {
        return projectAddress;
    }

    public String getCity() {
        return city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getEnquiryType() {
        return enquiryType;
    }

    public String getRole() {
        return role;
    }

    public String getBudget() {
        return budget;
    }

    public LocalDate getNeededBy() {
        return neededBy;
    }

    public String getComments() {
        return comments;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
