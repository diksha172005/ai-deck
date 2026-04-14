package com.aideckapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/verify?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify your AI-Deck account");
            message.setText(
                "Welcome to AI-Deck! 🤖\n\n" +
                "Please verify your email by clicking:\n\n" +
                link + "\n\n" +
                "This link expires in 24 hours.\n\n" +
                "If you did not create an account, ignore this email.\n\n" +
                "— AI-Deck Team"
            );

            mailSender.send(message);
            System.out.println("✅ Verification email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Email failed: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/reset-password?token=" + token;

            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Reset your AI-Deck password");
            message.setText(
                "Hi!\n\n" +
                "Reset your AI-Deck password here:\n\n" +
                link + "\n\n" +
                "This link expires in 15 minutes.\n\n" +
                "If you did not request this, ignore this email.\n\n" +
                "— AI-Deck Team"
            );

            mailSender.send(message);
            System.out.println("✅ Reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Reset email failed: " + e.getMessage());
        }
    }
}
