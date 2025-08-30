package com.robin_mayer.volabyte.entity

import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.Date

@Entity
@Table(name = "refresh_tokens")
class RefreshToken (
    val userId: String,
    val token: String
) {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    val expiresAt = Date(
        System.currentTimeMillis() + 1000 * 60 * 60 * 24 * 7
    ) // 7 days
}