package com.robin_mayer.volabyte.dto.response

import com.robin_mayer.volabyte.enums.UserRole
import java.util.Date

data class UserDTO (
    val id: String,
    val userName: String,
    val displayName: String,
    val role: UserRole,
    val lastLogin: Date?
)