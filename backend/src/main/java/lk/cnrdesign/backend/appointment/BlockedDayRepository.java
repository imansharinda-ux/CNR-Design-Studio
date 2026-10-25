package lk.cnrdesign.backend.appointment;

import java.time.LocalDate;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BlockedDayRepository extends JpaRepository<BlockedDay, Long> {

    boolean existsByDay(LocalDate day);

    List<BlockedDay> findByDayGreaterThanEqualOrderByDayAsc(LocalDate day);

    List<BlockedDay> findByDayBetweenOrderByDayAsc(LocalDate from, LocalDate to);
}
