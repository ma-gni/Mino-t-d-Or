package com.magnii.minotor.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.core.token.KeyBasedPersistenceTokenService;
import org.springframework.security.core.token.TokenService;

import java.security.SecureRandom;

@Configuration
@EnableConfigurationProperties(TokenProps.class)
public class TokenServiceConfig {

    @Bean
    @ConditionalOnMissingBean(TokenService.class)
    public TokenService tokenService(TokenProps props) {
        KeyBasedPersistenceTokenService ts = new KeyBasedPersistenceTokenService();
        ts.setServerSecret(props.serverSecret());
        ts.setServerInteger(props.serverInteger());
        ts.setSecureRandom(new SecureRandom());
        return ts;
    }
}

@ConfigurationProperties(prefix = "security.token")
record TokenProps(String serverSecret, int serverInteger) {}