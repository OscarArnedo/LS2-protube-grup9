package com.tecnocampus.LS2.protube_back.security.auth;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AuthenticationRequest {
    private String username;
    String password;
}
