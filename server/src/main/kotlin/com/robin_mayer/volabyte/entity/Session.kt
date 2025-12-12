package com.robin_mayer.volabyte.entity

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.Date

@Entity
@Table(name = "sessions")
class Session (
    val userId: String,
    @Column(unique = true)
    @Suppress("unused")
    val deviceId: String,
    @Suppress("unused")
    val deviceName: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    @Column(unique = true)
    var refreshToken: String = generateRefreshToken()
    var expiresAt: Date = generateExpiresAt()

    fun resetSession() {
        refreshToken = (1..128)
            .map { "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".random() }
            .joinToString("")
        expiresAt = generateExpiresAt()
    }

    private fun generateRefreshToken(): String {
        return (1..128)
            .map { "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".random() }
            .joinToString("")
    }

    private fun generateExpiresAt(): Date {
        return Date(System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7) // 7 days
    }
}