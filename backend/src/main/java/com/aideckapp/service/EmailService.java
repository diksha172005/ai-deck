package com.aideckapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

@Service
public class EmailService {

    @Value("${app.brevo.api-key}")
    private String apiKey;

    @Value("${app.brevo.from-email}")
    private String fromEmail;

    @Value("${app.brevo.from-name}")
    private String fromName;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/verify?token=" + token;
            String body = String.format("""
                {
                  "sender": {"name": "%s", "email": "%s"},
                  "to": [{"email": "%s"}],
                  "subject": "Verify your AI-Deck account",
                  "textContent": "Welcome to AI-Deck!\\n\\nPlease verify your email by clicking the link below:\\n\\n%s\\n\\nThis link expires in 24 hours.\\n\\nIf you did not create an account, ignore this email.\\n\\n— AI-Deck Team"
                }
                """, fromName, fromEmail, toEmail, link);

            String response = sendEmail(body);
            System.out.println("✅ Verification email sent to: " + toEmail + " | Response: " + response);
        } catch (Exception e) {
            System.err.println("❌ Verification email failed: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/reset-password?token=" + token;
            String body = String.format("""
                {
                  "sender": {"name": "%s", "email": "%s"},
                  "to": [{"email": "%s"}],
                  "subject": "Reset your AI-Deck password",
                  "textContent": "Hi!\\n\\nWe received a request to reset your AI-Deck password.\\n\\nClick the link below to set a new password:\\n\\n%s\\n\\nThis link expires in 15 minutes.\\n\\nIf you did not request this, ignore this email.\\n\\n— AI-Deck Team"
                }
                """, fromName, fromEmail, toEmail, link);

            String response = sendEmail(body);
            System.out.println("✅ Reset email sent to: " + toEmail + " | Response: " + response);
        } catch (Exception e) {
            System.err.println("❌ Reset email failed: " + e.getMessage());
        }
    }

    private String sendEmail(String jsonBody) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
            .header("api-key", apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        HttpResponse<String> response = client.send(
            request, HttpResponse.BodyHandlers.ofString());

        System.out.println("📧 Brevo response: " + response.statusCode()
            + " " + response.body());

        return response.statusCode() + " " + response.body();
    }
}
