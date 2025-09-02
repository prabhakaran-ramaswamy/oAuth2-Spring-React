package com.example.oauth.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class DefaultSecurityConfig {

	@Bean
	@Order(2)
	public SecurityFilterChain defaultSecurityFilterChain(HttpSecurity http) throws Exception {
		http
			.authorizeHttpRequests(authorize -> authorize
				.requestMatchers("/actuator/**", "/error", "/.well-known/**").permitAll()
				.anyRequest().authenticated()
			)
			.formLogin(form -> form
				.loginPage("/login")
				.permitAll()
			)
			.logout(logout -> logout
				.logoutSuccessUrl("/login?logout")
				.permitAll()
			);
		return http.build();
	}

	@Bean
	public UserDetailsService userDetailsService() {
		UserDetails user = User.builder()
			.username("testuser")
			.password(passwordEncoder().encode("testpassword"))
			.roles("USER")
			.authorities("ROLE_USER", "read")
			.build();

		UserDetails admin = User.builder()
			.username("admin")
			.password(passwordEncoder().encode("admin"))
			.roles("ADMIN", "USER")
			.authorities("ROLE_ADMIN", "ROLE_USER", "read", "write", "delete")
			.build();

		UserDetails manager = User.builder()
			.username("manager")
			.password(passwordEncoder().encode("manager123"))
			.roles("MANAGER", "USER")
			.authorities("ROLE_MANAGER", "ROLE_USER", "read", "write", "manage")
			.build();

		UserDetails developer = User.builder()
			.username("developer")
			.password(passwordEncoder().encode("developer123"))
			.roles("DEVELOPER", "USER")
			.authorities("ROLE_DEVELOPER", "ROLE_USER", "read", "write", "develop")
			.build();

		UserDetails viewer = User.builder()
			.username("viewer")
			.password(passwordEncoder().encode("viewer123"))
			.roles("VIEWER")
			.authorities("ROLE_VIEWER", "read")
			.build();

		return new InMemoryUserDetailsManager(user, admin, manager, developer, viewer);
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}
}
