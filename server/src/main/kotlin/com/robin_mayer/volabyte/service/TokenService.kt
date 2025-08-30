package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.enums.UserRole
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class TokenService (
    private val key: SecretKey
) {

    fun generateAccessToken(userId: String, role: UserRole): Pair<String, Date> {
        val expiration = Date(System.currentTimeMillis() + 1000 * 60 * 60) // 1 hour
        val accessToken = Jwts
            .builder()
            .subject(userId)
            .claim("role", role)
            .issuedAt(Date())
            .expiration(expiration)
            .signWith(key)
            .compact()
        return Pair(accessToken, expiration)
    }

    fun validateAccessToken(token: String): Claims? {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).payload
    }
}