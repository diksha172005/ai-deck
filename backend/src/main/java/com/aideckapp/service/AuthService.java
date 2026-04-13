package com.aideckapp.service;

import com.aideckapp.dto.AuthResponse;
import com.aideckapp.dto.LoginRequest;
import com.aideckapp.dto.SignupRequest;
import com.aideckapp.model.User;
import com.aideckapp.repository.UserRepository;
import com.aideckapp.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private EmailService emailService;

    public String signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered.");
        }

        String verificationToken = UUID.randomUUID().toString();

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setRole("USER");
        user.setEmailVerified(false);
        user.setVerificationToken(verificationToken);

        userRepository.save(user);

        // Send verification email
        emailService.sendVerificationEmail(request.getEmail(), verificationToken);

        return "Registration successful! Please check your email to verify your account.";
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password."));

        if (!user.getEmailVerified()) {
            throw new RuntimeException("Please verify your email before logging in.");
        }

        authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                request.getEmail(), request.getPassword())
        );

        String token = jwtUtils.generateToken(user.getEmail());
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getId());
    }

    public String verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired verification token."));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);

        return "Email verified successfully! You can now log in.";
    }

    public String forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("No account found with that email."));

        String resetToken = UUID.randomUUID().toString();
        user.setResetToken(resetToken);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(15));
        userRepository.save(user);

        emailService.sendPasswordResetEmail(email, resetToken);

        return "Password reset link sent to your email.";
    }

    public String resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid or expired reset token."));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Reset token has expired. Please request a new one.");
        }

        user.setPasswordHash(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return "Password reset successfully! You can now log in.";
    }
}
