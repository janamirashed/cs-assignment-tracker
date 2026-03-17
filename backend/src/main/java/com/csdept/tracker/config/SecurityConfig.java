package com.csdept.tracker.config;

import com.csdept.tracker.entity.User;
import com.csdept.tracker.repository.UserRepository;
import com.csdept.tracker.security.JwtFilter;
import com.csdept.tracker.security.JwtUtil;
import com.csdept.tracker.service.CustomOAuth2UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

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

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED)
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth2 -> oauth2
                .userInfoEndpoint(userInfo ->
                    userInfo.userService(customOAuth2UserService)
                )
                .successHandler((request, response, authentication) -> {
                    var oAuth2User = (org.springframework.security.oauth2.core.user.OAuth2User)
                            authentication.getPrincipal();
                    String email = oAuth2User.getAttribute("email");

                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));
                    String token = jwtUtil.generateToken(
                            user.getEmail(),
                            user.getRole().name(),
                            user.getId(),
                            user.getName(),
                            user.getPictureUrl()
                    );

                    response.sendRedirect(frontendRedirectUri + "?token=" + token);
                })
            )
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
