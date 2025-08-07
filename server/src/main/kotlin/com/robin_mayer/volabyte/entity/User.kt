package com.robin_mayer.volabyte.entity

import com.robin_mayer.volabyte.dto.response.UserDTO
import com.robin_mayer.volabyte.enums.UserRole
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.Date
import java.util.UUID

@Entity
@Table(name = "users")
class User (
    @Column(unique = true)
    var userName: String,
    var displayName: String,
    var password: String,
    @Enumerated(EnumType.STRING)
    var role: UserRole,
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Suppress("unused")
    var id: Long? = null
    @Column(unique = true)
    val userId = UUID.randomUUID().toString()
    @Suppress("unused")
    val createdAt = Date()
    var lastLoginAt = Date()

    fun toDTO(): UserDTO {
        return UserDTO(
            userId = userId,
            userName = userName,
            displayName = displayName,
            role = role
        )
    }
}