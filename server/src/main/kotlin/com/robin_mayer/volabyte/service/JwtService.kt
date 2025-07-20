package com.robin_mayer.volabyte.service

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService (
    private val key: SecretKey
) {

    fun generateToken(userId: String): String {
        return Jwts
            .builder()
            .subject(userId)
            .issuedAt(Date())
            .expiration(Date(System.currentTimeMillis() + 1000 * 60 * 10)) // 10 minutes
            .signWith(key)
            .compact()
    }

    fun validateToken(token: String): Claims? {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
    }
}