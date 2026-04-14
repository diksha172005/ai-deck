package com.aideckapp.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

@Service
public class EmailService {

    @Value("${app.brevo.api-key}")
    private String apiKey;

    @Value("${app.brevo.from-email}")
    private String fromEmail;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/verify?token=" + token;
            String body = "{"
                + "\"sender\":{\"name\":\"AI-Deck\",\"email\":\"" + fromEmail + "\"},"
                + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                + "\"subject\":\"Verify your AI-Deck account\","
                + "\"textContent\":\"Welcome to AI-Deck!\\n\\n"
                + "Please verify your email by clicking:\\n\\n"
                + link + "\\n\\n"
                + "This link expires in 24 hours.\\n\\n"
                + "If you did not create an account ignore this email.\\n\\n"
                + "AI-Deck Team\""
                + "}";

            int status = sendRequest(body);
            System.out.println("✅ Verification email status: " + status);
        } catch (Exception e) {
            System.err.println("❌ Email failed: " + e.getMessage());
        }
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String token) {
        try {
            String link = baseUrl + "/auth/reset-password?token=" + token;
            String body = "{"
                + "\"sender\":{\"name\":\"AI-Deck\",\"email\":\"" + fromEmail + "\"},"
                + "\"to\":[{\"email\":\"" + toEmail + "\"}],"
                + "\"subject\":\"Reset your AI-Deck password\","
                + "\"textContent\":\"Hi!\\n\\n"
                + "Reset your password here:\\n\\n"
                + link + "\\n\\n"
                + "This link expires in 15 minutes.\\n\\n"
                + "If you did not request this ignore this email.\\n\\n"
                + "AI-Deck Team\""
                + "}";

            int status = sendRequest(body);
            System.out.println("✅ Reset email status: " + status);
        } catch (Exception e) {
            System.err.println("❌ Reset email failed: " + e.getMessage());
        }
    }

    private int sendRequest(String jsonBody) throws Exception {
        HttpClient client = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

        HttpRequest request = HttpRequest.newBuilder()
            .uri(URI.create("https://api.brevo.com/v3/smtp/email"))
            .header("api-key", apiKey)
            .header("Content-Type", "application/json")
            .timeout(Duration.ofSeconds(10))
            .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
            .build();

        HttpResponse<String> response = client.send(
            request, HttpResponse.BodyHandlers.ofString());

        System.out.println("📧 Brevo API response: "
            + response.statusCode() + " " + response.body());

        return response.statusCode();
    }
}
