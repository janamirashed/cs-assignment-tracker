package com.csdept.tracker.service;

import com.csdept.tracker.entity.User;
import com.csdept.tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        log.info("Loading OAuth2 user from Google...");
        OAuth2User oAuth2User = super.loadUser(userRequest);

        String email = oAuth2User.getAttribute("email");
        String name = oAuth2User.getAttribute("name");
        String picture = oAuth2User.getAttribute("picture");
        log.info("OAuth2 user loaded: email={}, name={}", email, name);

        User user = userRepository.findByEmail(email).orElseGet(() -> {
            log.info("Creating new user for email: {}", email);
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setRole(User.Role.STUDENT);
            return newUser;
        });

        user.setName(name);
        user.setPictureUrl(picture);
        userRepository.save(user);
        log.info("User saved/updated: id={}, email={}", user.getId(), user.getEmail());

        return oAuth2User;
    }
}
