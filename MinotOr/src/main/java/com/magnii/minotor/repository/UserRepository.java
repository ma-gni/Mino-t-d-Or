package com.magnii.minotor.repository;

import com.magnii.minotor.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /** Used to check for duplicates during registration */
    boolean existsByUsername(String username);

    /** Loads a user by username, returning an Optional so you can call orElseThrow(). */
    Optional<User> findByUsername(String username);

}