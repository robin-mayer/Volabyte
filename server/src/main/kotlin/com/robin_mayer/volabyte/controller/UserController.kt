package com.robin_mayer.volabyte.controller

import com.robin_mayer.volabyte.dto.request.LoginUserDTO
import com.robin_mayer.volabyte.dto.request.LogoutUserDTO
import com.robin_mayer.volabyte.dto.request.UserSessionRefreshDTO
import com.robin_mayer.volabyte.dto.response.AuthDataDTO
import com.robin_mayer.volabyte.dto.response.UserDTO
import com.robin_mayer.volabyte.service.UserService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class UserController (
    private val userService: UserService,
) {

    @PostMapping("/users/login")
    fun login(
        @RequestBody loginUserDTO: LoginUserDTO
    ): ResponseEntity<AuthDataDTO> {
        val authData = userService.login(loginUserDTO)
        return ResponseEntity(authData, HttpStatus.OK)
    }

    @PostMapping("/users/session/refresh")
    fun refreshSession(
        @RequestBody userSessionRefreshDTO: UserSessionRefreshDTO
    ): ResponseEntity<AuthDataDTO> {
        val authData = userService.refreshUserSession(userSessionRefreshDTO.refreshToken)
        return ResponseEntity(authData, HttpStatus.OK)
    }

    @PostMapping("/users/logout")
    fun logout(
        authentication: Authentication,
        @RequestBody logoutUserDTO: LogoutUserDTO
    ): ResponseEntity<Void> {
        userService.logout(authentication.name, logoutUserDTO.deviceId)
        return ResponseEntity(null, HttpStatus.NO_CONTENT)
    }

    @GetMapping("/users/self")
    fun self(
        authentication: Authentication
    ): ResponseEntity<UserDTO> {
        val user = userService.getUser(authentication.name)
        return ResponseEntity(user.toDTO(), HttpStatus.OK)
    }

    @PostMapping("/users")
    fun create(): ResponseEntity<UserDTO> {
        // not implemented yet
        return ResponseEntity(null, HttpStatus.NOT_IMPLEMENTED)
    }
}