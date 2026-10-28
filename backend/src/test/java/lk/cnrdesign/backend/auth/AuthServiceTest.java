package lk.cnrdesign.backend.auth;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

class AuthServiceTest {

    private AdminRepository admins;
    private AdminSessionRepository sessions;
    private AuthService service;

    @BeforeEach
    void setUp() {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        admins = mock(AdminRepository.class);
        sessions = mock(AdminSessionRepository.class);
        service = new AuthService(admins, sessions, encoder, 8);
        Admin admin = new Admin("chanaka@example.com", "Chanaka Rambukwella", encoder.encode("secret-pass"));
        when(admins.findByEmailIgnoreCase("chanaka@example.com")).thenReturn(Optional.of(admin));
    }

    @Test
    void rejectsAWrongPassword() {
        assertThatThrownBy(() -> service.login(new LoginRequest("chanaka@example.com", "wrong")))
                .isInstanceOf(ResponseStatusException.class)
                .satisfies(e -> assertThat(((ResponseStatusException) e).getStatusCode().value()).isEqualTo(401));
        verify(sessions, never()).save(any());
    }

    @Test
    void rejectsAnUnknownEmail() {
        when(admins.findByEmailIgnoreCase("nobody@example.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.login(new LoginRequest("nobody@example.com", "secret-pass")))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void storesOnlyTheHashOfTheToken() {
        LoginResponse response = service.login(new LoginRequest("chanaka@example.com", "secret-pass"));

        assertThat(response.token()).isNotBlank();
        assertThat(response.name()).isEqualTo("Chanaka Rambukwella");
        verify(sessions).save(argThat(s -> s.getTokenHash().equals(AuthService.hash(response.token()))
                && !s.getTokenHash().equals(response.token())));
    }

    @Test
    void hashIsSha256Hex() {
        assertThat(AuthService.hash("abc"))
                .isEqualTo("ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
    }
}
