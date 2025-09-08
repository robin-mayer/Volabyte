package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.entity.Session
import com.robin_mayer.volabyte.exception.ApiException
import com.robin_mayer.volabyte.repository.SessionRepository
import org.springframework.http.HttpStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Date

@Service
@Transactional
class SessionService (
    private val sessionRepository: SessionRepository,
) {

    @Scheduled(cron = "0 * * * * *")
    fun invalidateExpiredSessions() {
        sessionRepository.deleteAllByExpiresAtBefore(Date())
    }

    fun findByRefreshToken(refreshToken: String): Session {
        val session = sessionRepository.findByRefreshToken(refreshToken) ?: throw ApiException("Invalid refresh token", HttpStatus.UNAUTHORIZED)
        if(session.expiresAt.before(Date())) {
            throw ApiException("Invalid refresh token", HttpStatus.UNAUTHORIZED)
        }
        return session
    }

    fun deleteById(id: Long) = sessionRepository.deleteById(id)

    fun deleteByUserIdAndDeviceId(userId: String, deviceId: String) = sessionRepository.deleteAllByUserIdAndDeviceId(userId, deviceId)

    fun createSession(userId: String, deviceId: String, deviceName: String): Session {
        val existingSession = sessionRepository.findByUserIdAndDeviceId(userId, deviceId)
        if(existingSession != null) {
            return renewSession(existingSession)
        } else {
            return sessionRepository.save(
                Session(
                    userId,
                    deviceId,
                    deviceName,
                )
            )
        }
    }

    fun renewSession(session: Session): Session {
        session.resetSession()
        return sessionRepository.save(session)
    }
}