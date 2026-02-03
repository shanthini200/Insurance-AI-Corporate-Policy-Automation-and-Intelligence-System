package com.insurance.insurance_backend.controller;

import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
