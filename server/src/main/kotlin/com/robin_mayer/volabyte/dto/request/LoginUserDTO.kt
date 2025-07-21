package com.robin_mayer.volabyte.dto.request

class LoginUserDTO (
    userName: String,
    password: String
) {
    val userName: String = userName.trim().lowercase()
    val password: String = password.trim()
}