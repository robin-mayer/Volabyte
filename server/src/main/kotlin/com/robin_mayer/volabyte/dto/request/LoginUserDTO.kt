package com.robin_mayer.volabyte.dto.request

class LoginUserDTO (
    userName: String,
    password: String,
    deviceId: String,
    deviceName: String
) {
    val userName: String = userName.trim().lowercase()
    val password: String = password.trim()
    val deviceId: String = deviceId.trim()
    val deviceName: String = deviceName.trim()
}