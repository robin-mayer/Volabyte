package com.robin_mayer.volabyte.dto.response

import com.robin_mayer.volabyte.enums.UserRole
import java.util.Date

data class AuthDataDTO (
    val accessToken: String,
    val accessTokenExpiresAt: Date,
    val refreshToken: String,
    val refreshTokenExpiresAt: Date,
    val role: UserRole
)