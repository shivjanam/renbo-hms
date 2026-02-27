package com.hospital.hms.security.service;

import com.hospital.hms.security.entity.User;
import com.hospital.hms.security.jwt.UserPrincipal;
import com.hospital.hms.security.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String usernameOrId) throws UsernameNotFoundException {
        User user;

        // Try to parse as ID first
        try {
            Long id = Long.parseLong(usernameOrId);
            user = userRepository.findById(id)
                    .orElseThrow(() -> new UsernameNotFoundException("User not found with id: " + id));
        } catch (NumberFormatException e) {
            // Not an ID, try mobile number, email, or username
            user = userRepository.findByMobileNumber(usernameOrId)
                    .or(() -> userRepository.findByEmail(usernameOrId))
                    .or(() -> userRepository.findByUsername(usernameOrId))
                    .orElseThrow(() -> new UsernameNotFoundException("User not found: " + usernameOrId));
        }

        if (user.getIsDeleted()) {
            throw new UsernameNotFoundException("User account has been deleted");
        }

        return UserPrincipal.create(user);
    }
}
