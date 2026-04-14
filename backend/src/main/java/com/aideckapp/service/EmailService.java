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

    @Value("${app.resend.api-key}")
    private String apiKey;

    @Value("${app.resend.from-email}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/verify?token=" + token;
            String body = String.format("""
                {
                  "from": "%s",
                  "to": ["%s"],
                  "subject": "Verify your AI-Deck account",
                  "text": "Welcome to AI-Deck!\\n\\nVerify your email here:\\n\\n%s\\n\\nExpires in 24 hours.\\n\\n— AI-Deck Team"
                }
                """, fromEmail, toEmail, link);

            sendEmail(body);
            System.out.println("✅ Verification email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Email failed: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/reset-password?token=" + token;
            String body = String.format("""
                {
                  "from": "%s",
                  "to": ["%s"],
                  "subject": "Reset your AI-Deck password",
                  "text": "Reset your password here:\\n\\n%s\\n\\nExpires in 15 minutes.\\n\\n— AI-Deck Team"
                }
                """, fromEmail, toEmail, link);

            sendEmail(body);
            System.out.println("✅ Reset email sent to: " + toEmail);
        } catch (Exception e) {
            System.err.println("❌ Reset email failed: " + e.getMessage());
        }
    }

    private void sendEmail(String jsonBody) throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.resend.com/emails"))
            .header("Authorization", "Bearer " + apiKey)
            .header("Content-Type", "application/json")
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        HttpResponse<String> response = client.send(request,
            HttpResponse.BodyHandlers.ofString());

        System.out.println("📧 Resend response: " + response.statusCode()
            + " " + response.body());
    }
}
