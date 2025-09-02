package com.example.oauth.util;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

public class ClientSecretGenerator {
    
    public static void main(String[] args) {
        String plainTextSecret = "demo-secret";
        
        // Generate BCrypt encoded password
        PasswordEncoder bcryptEncoder = new BCryptPasswordEncoder();
        String bcryptEncoded = bcryptEncoder.encode(plainTextSecret);
        
        System.out.println("Development: {noop}" + plainTextSecret);
        System.out.println("Production: {bcrypt}" + bcryptEncoded);
    }
}