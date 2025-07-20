package com.robin_mayer.volabyte.security

import io.jsonwebtoken.Jwts
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import javax.crypto.SecretKey

@Configuration
class JwtSecretKeyConfig {

    @Bean
    fun jwtSecretKey(): SecretKey {
        return Jwts.SIG.HS512.key().build()
    }
}