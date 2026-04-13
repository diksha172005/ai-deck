package com.aideckapp.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendVerificationEmail(String toEmail, String token) {
        String link = baseUrl + "/auth/verify?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Verify your AI-Deck account");
        message.setText(
            "Hi! Welcome to AI-Deck 🤖\n\n" +
            "Please verify your email address by clicking the link below:\n\n" +
            link + "\n\n" +
            "This link will expire in 24 hours.\n\n" +
            "If you did not create an account, ignore this email.\n\n" +
            "— AI-Deck Team"
        );

        mailSender.send(message);
    }

    public void sendPasswordResetEmail(String toEmail, String token) {
        String link = baseUrl + "/auth/reset-password?token=" + token;

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(fromEmail);
        message.setTo(toEmail);
        message.setSubject("Reset your AI-Deck password");
        message.setText(
            "Hi!\n\n" +
            "We received a request to reset your AI-Deck password.\n\n" +
            "Click the link below to set a new password:\n\n" +
            link + "\n\n" +
            "This link expires in 15 minutes.\n\n" +
            "If you didn't request this, ignore this email — your password won't change.\n\n" +
            "— AI-Deck Team"
        );

        mailSender.send(message);
    }
}
