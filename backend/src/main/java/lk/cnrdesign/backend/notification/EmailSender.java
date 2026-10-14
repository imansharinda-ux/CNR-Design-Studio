package lk.cnrdesign.backend.notification;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailSender {

    private static final Logger log = LoggerFactory.getLogger(EmailSender.class);

    private final ObjectProvider<JavaMailSender> mailSender;
    private final String from;

    public EmailSender(ObjectProvider<JavaMailSender> mailSender, @Value("${app.mail.from:${spring.mail.username:}}") String from) {
        this.mailSender = mailSender;
        this.from = from;
    }

    public boolean isEnabled() {
        return mailSender.getIfAvailable() != null && !from.isBlank();
    }

    @Async
    public void send(String to, String subject, String text) {
        JavaMailSender sender = mailSender.getIfAvailable();
        if (sender == null || from.isBlank()) {
            log.info("Email is not set up, so \"{}\" was not sent to {}", subject, to);
            return;
        }
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        try {
            sender.send(message);
            log.info("Email \"{}\" sent to {}", subject, to);
        } catch (Exception e) {
            log.warn("Could not send \"{}\" to {}: {}", subject, to, e.getMessage());
        }
    }
}
