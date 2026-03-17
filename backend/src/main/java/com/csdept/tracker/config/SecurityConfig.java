package com.csdept.tracker.config;

import com.csdept.tracker.entity.User;
import com.csdept.tracker.repository.UserRepository;
import com.csdept.tracker.security.JwtFilter;
import com.csdept.tracker.security.JwtUtil;
import com.csdept.tracker.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Slf4j
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtFilter jwtFilter;
    private final JwtUtil jwtUtil;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final UserRepository userRepository;

    @Value("${app.oauth2.redirect-uri}")
    private String frontendRedirectUri;

    @Value("${app.cors.allowed-origins}")
    private String frontendBaseUrl;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/oauth2/**", "/login/oauth2/**", "/login/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo ->
                    userInfo.userService(customOAuth2UserService)
                )
                .successHandler((request, response, authentication) -> {
                    try {
                        var oAuth2User = (org.springframework.security.oauth2.core.user.OAuth2User)
                                authentication.getPrincipal();
                        String email = oAuth2User.getAttribute("email");
                        log.info("OAuth2 login success for email: {}", email);

                        User user = userRepository.findByEmail(email)
                                .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login: " + email));

                        // Hardcode failsafe for the admin email to guarantee they get the ADMIN role
                        if ("janasarchives@gmail.com".equalsIgnoreCase(email)) {
                            user.setRole(User.Role.ADMIN);
                            userRepository.save(user);
                        }

                        String token = jwtUtil.generateToken(
                                user.getEmail(),
                                user.getRole().name(),
                                user.getId(),
                                user.getName(),
                                user.getPictureUrl()
                        );

                        String finalRedirectUri = frontendRedirectUri;
                        if (!finalRedirectUri.contains("#/oauth2/callback")) {
                            finalRedirectUri = finalRedirectUri.replace("/oauth2/callback", "/#/oauth2/callback");
                        }
                        
                        log.info("JWT generated, redirecting to frontend for user: {} to URL: {}", email, finalRedirectUri);
                        response.sendRedirect(finalRedirectUri + "?token=" + token);
                    } catch (Exception e) {
                        log.error("Error in OAuth2 success handler", e);
                        response.sendRedirect(frontendBaseUrl + "/cs-assignment-tracker/#/login"
                                + "?error=" + URLEncoder.encode(e.getMessage(), StandardCharsets.UTF_8));
                    }
                })
                .failureHandler((request, response, exception) -> {
                    log.error("OAuth2 login failure: {}", exception.getMessage(), exception);
                    response.sendRedirect(frontendBaseUrl + "/cs-assignment-tracker/#/login"
                            + "?error=" + URLEncoder.encode("Authentication failed: " + exception.getMessage(), StandardCharsets.UTF_8));
                })
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
