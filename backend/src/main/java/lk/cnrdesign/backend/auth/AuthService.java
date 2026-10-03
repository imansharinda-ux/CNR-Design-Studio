package lk.cnrdesign.backend.auth;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    private static final SecureRandom RANDOM = new SecureRandom();

    private final AdminRepository admins;
    private final AdminSessionRepository sessions;
    private final PasswordEncoder passwordEncoder;
    private final long sessionHours;

    public AuthService(
            AdminRepository admins,
            AdminSessionRepository sessions,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.session-hours:8}") long sessionHours) {
        this.admins = admins;
        this.sessions = sessions;
        this.passwordEncoder = passwordEncoder;
        this.sessionHours = sessionHours;
    }

    @Transactional
    public LoginResponse login(LoginRequest request) {
        Admin admin = admins.findByEmailIgnoreCase(request.email().trim())
                .filter(a -> passwordEncoder.matches(request.password(), a.getPasswordHash()))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Wrong email or password"));

        sessions.deleteByExpiresAtBefore(LocalDateTime.now());

        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
        LocalDateTime expiresAt = LocalDateTime.now().plusHours(sessionHours);
        sessions.save(new AdminSession(hash(token), admin, expiresAt));

        return new LoginResponse(token, admin.getName(), admin.getEmail(), expiresAt.toString());
    }

    @Transactional
    public void logout(String token) {
        if (token != null && !token.isBlank()) {
            sessions.deleteByTokenHash(hash(token));
        }
    }

    @Transactional(readOnly = true)
    public Optional<Admin> findAdmin(String token) {
        if (token == null || token.isBlank()) {
            return Optional.empty();
        }
        return sessions.findByTokenHash(hash(token))
                .filter(s -> s.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(AdminSession::getAdmin);
    }

    static String hash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(token.getBytes(StandardCharsets.UTF_8)));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(e);
        }
    }
}
