package com.tecnocampus.LS2.protube_back.security.auth;

import com.tecnocampus.LS2.protube_back.security.configuration.JwtService;
import com.tecnocampus.LS2.protube_back.security.configuration.UserSecurityDetailsService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserSecurityDetailsService userSecurityDetailsService;

    public AuthenticationService(JwtService jwtService, AuthenticationManager authenticationManager, UserSecurityDetailsService userLabDetailsService) {
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
        this.userSecurityDetailsService = userLabDetailsService;
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getUsername(),
                            request.getPassword()
                    )
            );
        } catch (Exception e) {
            throw new RuntimeException("Invalid username or password", e);
        }
        UserDetails userDetails = this.userSecurityDetailsService.loadUserByUsername(request.getUsername());
        var jwtToken = jwtService.generateToken(userDetails);
        AuthenticationResponse response = new AuthenticationResponse();
        response.setAccessToken(jwtToken);

        return response;
    }
}
