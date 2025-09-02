package com.example.oauth.controller;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UserInfoController {

	@GetMapping("/userinfo")
	public Map<String, Object> userInfo(Principal principal, Authentication authentication) {
		Map<String, Object> userInfo = new HashMap<>();
		
		if (authentication instanceof JwtAuthenticationToken jwtAuth) {
			Jwt jwt = jwtAuth.getToken();
			userInfo.put("sub", jwt.getSubject());
			userInfo.put("name", jwt.getSubject());
			userInfo.put("preferred_username", jwt.getSubject());
			userInfo.put("email", jwt.getSubject() + "@example.com");
			userInfo.put("email_verified", true);
			userInfo.put("scope", jwt.getClaimAsString("scope"));
		} else {
			userInfo.put("sub", principal.getName());
			userInfo.put("name", principal.getName());
			userInfo.put("preferred_username", principal.getName());
			userInfo.put("email", principal.getName() + "@example.com");
			userInfo.put("email_verified", true);
		}
		
		return userInfo;
	}
}
