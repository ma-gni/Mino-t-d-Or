package com.magnii.minotor;

import com.magnii.minotor.model.User;
import com.magnii.minotor.repository.UserRepository;
import com.magnii.minotor.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    @Test
    public void testGetUserByUsername_Success() {
        String username = "testuser";
        User user = new User();
        user.setId(1L);
        user.setUsername(username);
        user.setEmail("test@example.com");
        user.setPassword("hashedpassword");
        user.setAddress("123 Test St");

        when(userRepository.findByUsername(username)).thenReturn(user);

        Optional<User> result = userService.getUserByUsername(username);
        assertTrue(result.isPresent());
        assertEquals(username, result.get().getUsername());
        verify(userRepository, times(1)).findByUsername(username);
    }
}