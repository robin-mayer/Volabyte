package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.Session
import org.springframework.data.jpa.repository.JpaRepository
import java.util.Date

interface SessionRepository: JpaRepository<Session, Long> {
    fun findByRefreshToken(refreshToken: String): Session?
    fun findByUserIdAndDeviceId(userId: String, deviceId: String): Session?
    fun deleteAllByUserIdAndDeviceId(userId: String, deviceId: String)
    fun deleteAllByExpiresAtBefore(before: Date)
}