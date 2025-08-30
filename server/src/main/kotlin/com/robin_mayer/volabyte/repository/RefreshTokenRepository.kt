package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository

interface RefreshTokenRepository: JpaRepository<RefreshToken, Long> {
    fun deleteAllByUserId(userId: String)
}