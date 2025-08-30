package com.robin_mayer.volabyte.entity

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
    val deviceId: String,
    @Suppress("unused")
    val deviceName: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    val refreshToken: String = (1..64)
        .map { "\"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".random() }
        .joinToString("")
    val expiresAt = Date(
        System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7
    ) // 7 days
}