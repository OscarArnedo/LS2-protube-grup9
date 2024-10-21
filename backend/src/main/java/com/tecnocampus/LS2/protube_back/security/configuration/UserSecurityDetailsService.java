package com.tecnocampus.LS2.protube_back.security.configuration;

import com.tecnocampus.LS2.protube_back.domain.UserSecurity;
import com.tecnocampus.LS2.protube_back.persistance.UserSecurityRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserSecurityDetailsService implements UserDetailsService {
    private UserSecurityRepository userSecurityRepository;

    public UserSecurityDetailsService(UserSecurityRepository userSecurityRepository) {
        this.userSecurityRepository = userSecurityRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        UserSecurity user = userSecurityRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username: " + username));

        return UserSecurityDetails.build(user);
    }
}
