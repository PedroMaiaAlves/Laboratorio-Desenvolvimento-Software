package com.moedas.security;

import jakarta.inject.Singleton;
import org.springframework.security.crypto.password.PasswordEncoder;

@Singleton
public class BCryptPasswordEncoderService implements PasswordEncoder {

    @Override
    public String encode(CharSequence rawPassword) {
        return BCryptPasswordEncoderService.encode(encode(rawPassword));
    }
}
