package lk.cnrdesign.backend.common;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatCode;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.time.Instant;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.server.ResponseStatusException;

class SpamGuardTest {

    @Test
    void blocksFormsWhereTheHiddenFieldIsFilled() {
        SpamGuard guard = new SpamGuard(5, 10);

        assertThatThrownBy(() -> guard.check(new MockHttpServletRequest(), "http://spam.example", "enquiry"))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode().value()).isEqualTo(400));
    }

    @Test
    void limitsRequestsFromOneAddress() {
        SpamGuard guard = new SpamGuard(3, 10);
        Instant now = Instant.parse("2026-10-01T10:00:00Z");

        guard.allow("booking:1.2.3.4", now);
        guard.allow("booking:1.2.3.4", now);
        guard.allow("booking:1.2.3.4", now);

        assertThatThrownBy(() -> guard.allow("booking:1.2.3.4", now))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode().value()).isEqualTo(429));
        assertThatCode(() -> guard.allow("booking:5.6.7.8", now)).doesNotThrowAnyException();
        assertThatCode(() -> guard.allow("booking:1.2.3.4", now.plusSeconds(11 * 60))).doesNotThrowAnyException();
    }

    @Test
    void usesTheForwardedAddressWhenPresent() {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setRemoteAddr("10.0.0.1");
        request.addHeader("X-Forwarded-For", "203.0.113.9, 10.0.0.1");

        assertThat(SpamGuard.clientIp(request)).isEqualTo("203.0.113.9");
    }
}
