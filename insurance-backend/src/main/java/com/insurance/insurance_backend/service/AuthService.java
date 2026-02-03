package com.insurance.insurance_backend.service;

import com.insurance.insurance_backend.dto.LoginRequest;
import com.insurance.insurance_backend.dto.RegisterRequest;
import com.insurance.insurance_backend.entity.Role;
import com.insurance.insurance_backend.entity.User;
import com.insurance.insurance_backend.entity.VerificationToken;
import com.insurance.insurance_backend.repository.UserRepository;
import com.insurance.insurance_backend.repository.VerificationTokenRepository;
import com.insurance.insurance_backend.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    public void register(RegisterRequest request) {
        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        
        try {
            user.setRole(Role.valueOf(request.getRole().toUpperCase()));
        } catch (Exception e) {
            user.setRole(Role.CUSTOMER);
        }
        
        // FIX 1: Changed setIs_verified -> setVerified
        user.setVerified(false); 

        userRepository.save(user);

        String token = UUID.randomUUID().toString();
        VerificationToken verificationToken = new VerificationToken();
        verificationToken.setToken(token);
        verificationToken.setUser(user);
        verificationToken.setExpiryDate(LocalDateTime.now().plusHours(24));
        
        verificationTokenRepository.save(verificationToken);

        emailService.sendVerificationEmail(request.getEmail(), token);
    }

    public String login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // FIX 2: Changed getIs_verified -> isVerified
        if (!user.isVerified()) {
            throw new RuntimeException("Account not verified. Please check your email.");
        }

        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole().name());

        return jwtService.generateToken(claims, user);
    }

    public boolean verifyEmail(String token) {
        VerificationToken verificationToken = verificationTokenRepository.findByToken(token)
                .orElse(null);
        
        if (verificationToken == null || verificationToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            return false;
        }

        User user = verificationToken.getUser();
        // FIX 3: Changed setIs_verified -> setVerified
        user.setVerified(true); 
        userRepository.save(user);
        
        verificationTokenRepository.delete(verificationToken);
        return true;
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusHours(1));
        userRepository.save(user);

        String resetLink = "http://localhost:5173/reset-password?token=" + token;
        emailService.sendEmail(user.getEmail(), "Password Reset Request", 
            "Click the link to reset your password: " + resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        User user = userRepository.findByResetToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Token expired");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);
    }
}