package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.entity.RefreshToken
import com.robin_mayer.volabyte.enums.UserRole
import com.robin_mayer.volabyte.repository.RefreshTokenRepository
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Date
import javax.crypto.SecretKey

@Service
@Transactional
class TokenService (
    private val key: SecretKey,
    private val refreshTokenRepository: RefreshTokenRepository,
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

    fun generateRefreshToken(userId: String): Pair<String, Date> {
        refreshTokenRepository.deleteAllByUserId(userId)

        val token = (1..64)
            .map { "\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".random() }
            .joinToString("")

        val refreshToken = RefreshToken(userId, token)
        refreshTokenRepository.save(refreshToken)

        return Pair(refreshToken.token, refreshToken.expiresAt)
    }
}