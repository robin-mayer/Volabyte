package com.robin_mayer.volabyte.dto.response

import com.robin_mayer.volabyte.enums.UserRole

data class UserDTO (
    val userId: String,
    val userName: String,
    val displayName: String,
    val role: UserRole
)