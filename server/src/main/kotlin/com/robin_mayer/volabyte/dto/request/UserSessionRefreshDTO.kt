package com.robin_mayer.volabyte.dto.request

class UserSessionRefreshDTO (
    refreshToken: String
) {
    val refreshToken: String = refreshToken.trim()
}