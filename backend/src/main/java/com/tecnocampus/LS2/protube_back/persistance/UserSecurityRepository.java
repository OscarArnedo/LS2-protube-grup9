package com.tecnocampus.LS2.protube_back.persistance;

import com.tecnocampus.LS2.protube_back.domain.UserSecurity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserSecurityRepository extends JpaRepository<UserSecurity, Long> {

    Optional<UserSecurity> findByUsername(String username);

    Optional<UserSecurity> findByEmail(@Email String email);
}
