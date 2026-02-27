package com.hospital.hms.security.jwt;

import com.hospital.hms.common.enums.UserRole;
import com.hospital.hms.security.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
@Builder
public class UserPrincipal implements UserDetails {

    private Long id;
    private String username;
    private String mobileNumber;
    private String email;
    private String password;
    private String displayName;
    private UserRole primaryRole;
    private Set<UserRole> roles;
    private Long hospitalId;
    private Long departmentId;
    private boolean enabled;
    private boolean locked;
    private boolean mobileVerified;

    public static UserPrincipal create(User user) {
        Set<UserRole> allRoles = new HashSet<>(user.getRoles());
        allRoles.add(user.getPrimaryRole());

        return UserPrincipal.builder()
                .id(user.getId())
                .username(user.getUsername() != null ? user.getUsername() : user.getMobileNumber())
                .mobileNumber(user.getMobileNumber())
                .email(user.getEmail())
                .password(user.getPasswordHash())
                .displayName(user.getDisplayName())
                .primaryRole(user.getPrimaryRole())
                .roles(allRoles)
                .hospitalId(user.getHospitalId())
                .departmentId(user.getDepartmentId())
                .enabled(user.getIsActive())
                .locked(user.getIsLocked() != null && user.getIsLocked())
                .mobileVerified(user.getIsMobileVerified() != null && user.getIsMobileVerified())
                .build();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority("ROLE_" + role.name()))
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return !locked;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public boolean hasRole(UserRole role) {
        return roles.contains(role);
    }

    public boolean hasAnyRole(UserRole... checkRoles) {
        for (UserRole role : checkRoles) {
            if (hasRole(role)) return true;
        }
        return false;
    }

    public boolean canAccessHospital(Long targetHospitalId) {
        if (hasRole(UserRole.SUPER_ADMIN)) return true;
        return hospitalId != null && hospitalId.equals(targetHospitalId);
    }
}
