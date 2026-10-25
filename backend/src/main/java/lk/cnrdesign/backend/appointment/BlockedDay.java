package lk.cnrdesign.backend.appointment;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDate;

@Entity
@Table(name = "blocked_days")
public class BlockedDay {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "blocked_date", nullable = false, unique = true)
    private LocalDate day;

    @Column(length = 120)
    private String reason;

    protected BlockedDay() {
    }

    public BlockedDay(LocalDate day, String reason) {
        this.day = day;
        this.reason = reason;
    }

    public Long getId() {
        return id;
    }

    public LocalDate getDay() {
        return day;
    }

    public String getReason() {
        return reason;
    }
}
