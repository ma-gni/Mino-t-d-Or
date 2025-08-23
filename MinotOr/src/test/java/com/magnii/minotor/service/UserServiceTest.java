package com.magnii.minotor.service;

import com.magnii.minotor.model.Role;
import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.RoleRepository;
import com.magnii.minotor.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.*;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock UserRepository userRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock RoleRepository roleRepository;

    @InjectMocks UserService userService;

    @Test
    void saveUser_encodesPassword_andPersists() {
        User u = new User();
        u.setUsername("alice");
        u.setPassword("plain");
        u.setEmail("alice@example.com");

        when(passwordEncoder.encode("plain")).thenReturn("ENCODED");
        when(userRepository.save(any(User.class))).thenAnswer(inv -> inv.getArgument(0));

        User saved = userService.saveUser(u);

        assertThat(saved.getPassword()).isEqualTo("ENCODED");
        verify(userRepository).save(saved);
    }

    @Test
    void getUserByUsername_found() {
        User u = new User();
        u.setUsername("bob");
        when(userRepository.findByUsername("bob")).thenReturn(Optional.of(u));

        Optional<User> res = userService.getUserByUsername("bob");
        assertThat(res).isPresent();
        assertThat(res.get().getUsername()).isEqualTo("bob");
    }

    @Test
    void getUsers_returnsAll() {
        when(userRepository.findAll()).thenReturn(List.of(new User(), new User()));
        assertThat(userService.getUsers()).hasSize(2);
    }

    @Test
    void deleteUserByUsername_whenExists_returnsTrue() {
        when(userRepository.existsByUsername("carol")).thenReturn(true);
        boolean ok = userService.deleteUserByUsername("carol");
        assertThat(ok).isTrue();
        verify(userRepository).deleteByUsername("carol");
    }

    @Test
    void deleteUserByUsername_whenMissing_returnsFalse() {
        when(userRepository.existsByUsername("nope")).thenReturn(false);
        boolean ok = userService.deleteUserByUsername("nope");
        assertThat(ok).isFalse();
        verify(userRepository, never()).deleteByUsername(anyString());
    }

    @Test
    void assignRole_happyPath() {
        User u = new User();
        u.setUsername("dave");
        u.setRoles(new HashSet<>());

        Role r = new Role();
        r.setId(1L);
        r.setName("ADMIN");

        when(userRepository.findByUsername("dave")).thenReturn(Optional.of(u));
        when(roleRepository.findByName("ADMIN")).thenReturn(Optional.of(r));

        userService.assignRole("dave", "ADMIN");

        assertThat(u.getRoles()).contains(r);
        verify(userRepository).save(u);
    }

    @Test
    void assignRole_userNotFound_throws() {
        when(userRepository.findByUsername("ghost")).thenReturn(Optional.empty());
        assertThatThrownBy(() -> userService.assignRole("ghost", "ADMIN"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("User not found");
    }

    @Test
    void assignRole_roleNotFound_throws() {
        User u = new User();
        u.setUsername("eve");
        u.setRoles(new HashSet<>());
        when(userRepository.findByUsername("eve")).thenReturn(Optional.of(u));
        when(roleRepository.findByName("MISSING")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.assignRole("eve", "MISSING"))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Role not found");
    }
}