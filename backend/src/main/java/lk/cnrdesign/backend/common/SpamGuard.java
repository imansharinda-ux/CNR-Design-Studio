package lk.cnrdesign.backend.common;

import jakarta.servlet.http.HttpServletRequest;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

@Component
public class SpamGuard {

    private final int limit;
    private final Duration window;
    private final Map<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    public SpamGuard(
            @Value("${app.spam.limit:8}") int limit,
            @Value("${app.spam.window-minutes:10}") long windowMinutes) {
        this.limit = limit;
        this.window = Duration.ofMinutes(windowMinutes);
    }

    public void check(HttpServletRequest request, String honeypot, String action) {
        if (honeypot != null && !honeypot.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Your request could not be sent.");
        }
        allow(action + ":" + clientIp(request), Instant.now());
    }

    void allow(String key, Instant now) {
        Deque<Instant> times = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (times) {
            Instant cutoff = now.minus(window);
            while (!times.isEmpty() && times.peekFirst().isBefore(cutoff)) {
                times.pollFirst();
            }
            if (times.size() >= limit) {
                throw new ResponseStatusException(HttpStatus.TOO_MANY_REQUESTS,
                        "Too many requests from your connection. Please try again in a few minutes.");
            }
            times.addLast(now);
        }
    }

    static String clientIp(HttpServletRequest request) {
        String forwarded = request.getHeader("X-Forwarded-For");
        if (forwarded != null && !forwarded.isBlank()) {
            return forwarded.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}
