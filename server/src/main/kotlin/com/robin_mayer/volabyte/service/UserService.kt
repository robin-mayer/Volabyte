package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.dto.request.LoginUserDTO
import com.robin_mayer.volabyte.dto.response.AuthDataDTO
import com.robin_mayer.volabyte.entity.User
import com.robin_mayer.volabyte.enums.UserRole
import com.robin_mayer.volabyte.exception.ApiException
import com.robin_mayer.volabyte.repository.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.Date

@Service
@Transactional
class UserService (
    private val tokenService: TokenService,
    private val userRepository: UserRepository,
    private val sessionService: SessionService
) {

    @Value("\${user.password.hash.salt}")
    val passwordHashSalt: String? = null
    private val passwordEncoder = BCryptPasswordEncoder()

    fun login(input: LoginUserDTO): AuthDataDTO {
        val user = userRepository.findByUserName(input.userName) ?: throw ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED)

        if (!passwordEncoder.matches(input.password + passwordHashSalt, user.password)) {
            throw ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED)
        }

        user.lastLoginAt = Date()
        userRepository.save(user)

        val accessTokenPair = tokenService.generateAccessToken(user.id!!, user.role)
        val session = sessionService.createSession(user.id!!, input.deviceId, input.deviceName)

        return AuthDataDTO(
            accessTokenPair.first,
            accessTokenPair.second,
            session.refreshToken,
            session.expiresAt,
            user.role
        )
    }

    fun refreshUserSession(refreshToken: String): AuthDataDTO {
        val session = sessionService.findByRefreshToken(refreshToken)

        val userOptional = userRepository.findById(session.userId)
        if(userOptional.isEmpty) {
            sessionService.deleteById(session.id!!)
            throw ApiException("Invalid refresh token", HttpStatus.UNAUTHORIZED)
        }

        val user = userOptional.get()
        user.lastLoginAt = Date()
        userRepository.save(user)

        val accessTokenPair = tokenService.generateAccessToken(user.id!!, user.role)
        val renewedSession = sessionService.renewSession(session)

        return AuthDataDTO(
            accessTokenPair.first,
            accessTokenPair.second,
            renewedSession.refreshToken,
            renewedSession.expiresAt,
            user.role
        )
    }

    fun logout(userId: String, deviceId: String) {
        sessionService.deleteByUserIdAndDeviceId(userId, deviceId)
    }

    fun createUser(
        userName: String,
        displayName: String,
        password: String,
        role: UserRole,
    ): User {
        if (userRepository.existsByUserName(userName)) {
            throw ApiException("Username already exists", HttpStatus.BAD_REQUEST)
        }

        val hashedPassword = passwordEncoder.encode(password + passwordHashSalt)
        val user = User(
            userName.lowercase(),
            displayName,
            hashedPassword,
            role
        )

        return userRepository.save(user)
    }

    fun createInitialAdmin() {
        if(userRepository.count() == 0L) {
            createUser(
                "admin",
                "Admin",
                "admin",
                UserRole.ADMIN
            )
        }
    }

    fun getUser(id: String): User {
        val user = userRepository.findById(id)
        if(user.isPresent) {
            return user.get()
        } else {
            throw ApiException("User not found", HttpStatus.NOT_FOUND)
        }
    }
}