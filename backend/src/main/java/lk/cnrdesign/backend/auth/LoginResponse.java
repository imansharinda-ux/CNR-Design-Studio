package lk.cnrdesign.backend.auth;

public record LoginResponse(String token, String name, String email, String expiresAt) {
}
