package lk.cnrdesign.backend.auth;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);

    private final AdminRepository admins;
    private final PasswordEncoder passwordEncoder;
    private final String email;
    private final String name;
    private final String password;

    public AdminSeeder(
            AdminRepository admins,
            PasswordEncoder passwordEncoder,
            @Value("${app.admin.email:rambukwella77@yahoo.com}") String email,
            @Value("${app.admin.name:Chanaka Rambukwella}") String name,
            @Value("${app.admin.password:}") String password) {
        this.admins = admins;
        this.passwordEncoder = passwordEncoder;
        this.email = email;
        this.name = name;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (admins.count() > 0) {
            return;
        }
        if (password == null || password.isBlank()) {
            log.warn("No admin account yet. Set app.admin.password in application-local.properties and restart.");
            return;
        }
        admins.save(new Admin(email, name, passwordEncoder.encode(password)));
        log.info("Created admin account for {}", email);
    }
}
