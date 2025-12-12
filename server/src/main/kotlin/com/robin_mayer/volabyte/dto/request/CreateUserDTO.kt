package com.robin_mayer.volabyte.dto.request

import com.robin_mayer.volabyte.enums.UserRole

class CreateUserDTO (
    userName: String,
    displayName: String,
    password: String,
    val role: UserRole
) {
    val userName: String = userName.trim().lowercase()
    val displayName: String = displayName.trim()
    val password: String = password.trim()
}