package com.robin_mayer.volabyte.service

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
    private val jwtService: JwtService,
    private val userRepository: UserRepository,
) {

    @Value("\${user.password.hash.salt}")
    val passwordHashSalt: String? = null
    private val passwordEncoder = BCryptPasswordEncoder()

    fun login(userName: String, password: String): AuthDataDTO {
        val user = userRepository.findByUserName(userName) ?: throw ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED)

        if (!passwordEncoder.matches(password + passwordHashSalt, user.password)) {
            throw ApiException("Invalid credentials", HttpStatus.UNAUTHORIZED)
        }

        user.lastLoginAt = Date()
        userRepository.save(user)

        return AuthDataDTO(
            accessToken = jwtService.generateToken(user.id!!, user.role),
        )
    }

    fun createUser(
        userName: String,
        displayName: String,
        password: String,
        role: UserRole,
    ): User {
        if (doesUserNameExist(userName)) {
            throw ApiException("Username already exists", HttpStatus.BAD_REQUEST)
        }

        val hashedPassword = passwordEncoder.encode(password + passwordHashSalt)
        val user = User(
            userName = userName.lowercase(),
            displayName = displayName,
            password = hashedPassword,
            role = role
        )

        return userRepository.save(user)
    }

    fun doesUserNameExist(userName: String): Boolean {
        return userRepository.existsByUserName(userName)
    }

    fun getUser(id: String): User {
        return userRepository.findById(id) ?: throw ApiException("User not found", HttpStatus.NOT_FOUND)
    }
}