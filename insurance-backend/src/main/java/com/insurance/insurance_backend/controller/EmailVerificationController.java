// package com.insurance.insurance_backend.controller;

// import com.insurance.insurance_backend.model.VerificationToken;
// import com.insurance.insurance_backend.repository.UserRepository;
// import com.insurance.insurance_backend.service.VerificationTokenService;
// import lombok.RequiredArgsConstructor;
// import org.springframework.web.bind.annotation.*;

// @RestController
// @RequestMapping("/api/auth")
// @RequiredArgsConstructor
// public class EmailVerificationController {

//     private final VerificationTokenService tokenService;
//     private final UserRepository userRepository;

//     @GetMapping("/verify")
//     public String verifyEmail(@RequestParam String token) {

//         VerificationToken verificationToken =
//                 tokenService.validateToken(token);

//         var user = verificationToken.getUser();
//         user.setEnabled(true);
//         userRepository.save(user);

//         tokenService.delete(verificationToken);

//         return "Email verified successfully. You may now login.";
//     }
// }
