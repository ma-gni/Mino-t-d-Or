package com.magnii.minotor.service;

import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    // We have updated the old user code to be capable of adding the password hashing using the passwrod encoder provided by spring

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor injection for userRepository and passwordEncoder.
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void saveUser(User user) {
        // Hash the plain-text password before saving.
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        userRepository.save(user);
    }

    public Optional<User> getUserByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username));
    }

    public List<User> getUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public void deleteUser(User user) {
        userRepository.delete(user);
    }
}