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

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/verify?token=" + token;
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(toEmail);
            message.setSubject("Verify your AI-Deck account");
            message.setText(
                "Hi! Welcome to AI-Deck 🤖\n\n" +
                "Please verify your email by clicking:\n\n" +
                link + "\n\n" +
                "Link expires in 24 hours.\n\n" +
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
                "Reset your password here:\n\n" +
                link + "\n\n" +
                "Link expires in 15 minutes.\n\n" +
                "— AI-Deck Team"
            );
            mailSender.send(message);
            System.out.println("✅ Reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Reset email failed: " + e.getMessage());
        }
    }
}
