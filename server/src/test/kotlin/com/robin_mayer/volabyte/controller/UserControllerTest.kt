package com.robin_mayer.volabyte.controller

import com.robin_mayer.volabyte.dto.request.LoginUserDTO
import com.robin_mayer.volabyte.dto.request.LogoutUserDTO
import com.robin_mayer.volabyte.dto.request.UserSessionRefreshDTO
import com.robin_mayer.volabyte.dto.response.AuthDataDTO
import com.robin_mayer.volabyte.dto.response.UserDTO
import com.robin_mayer.volabyte.enums.UserRole
import com.robin_mayer.volabyte.exception.ApiExceptionDTO
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.MethodOrderer
import org.junit.jupiter.api.Order
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.junit.jupiter.api.TestMethodOrder
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import kotlin.test.assertEquals

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
@TestMethodOrder(MethodOrderer.OrderAnnotation::class)
class UserControllerTest {

    @Autowired
    private lateinit var restTemplate: TestRestTemplate

    private var validAccessToken: String? = null
    private var validRefreshToken: String? = null

    @Test
    @Order(1)
    fun refreshSession_InvalidRefreshToken() {
        // given
        val refreshToken = "invalid_refresh_token"

        // when
        val response = restTemplate.exchange(
            "/users/session/refresh",
            HttpMethod.POST,
            HttpEntity(UserSessionRefreshDTO(refreshToken), null),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid refresh token", response.body?.message)
    }

    @Test
    @Order(2)
    fun refreshSession_ExpiredRefreshToken() {
        // given
        val refreshToken = "expired_refresh_token"

        // when
        val response = restTemplate.exchange(
            "/users/session/refresh",
            HttpMethod.POST,
            HttpEntity(UserSessionRefreshDTO(refreshToken), null),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid refresh token", response.body?.message)
    }

    @Test
    @Order(3)
    fun login() {
        // given
        val loginUserDTO = LoginUserDTO(
            userName = "bob",
            password = "password",
            "device-id",
            "Device name"
        )

        // when
        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(loginUserDTO),
            AuthDataDTO::class.java
        )

        // then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertTrue(response.body?.accessToken!!.length > 50)
        assertTrue(response.body?.refreshToken!!.length == 128)
        validAccessToken = response.body?.accessToken
        validRefreshToken = response.body?.refreshToken
    }

    @Test
    @Order(4)
    fun loginUser_InvalidUserName() {
        // given
        val loginUserDTO = LoginUserDTO(
            userName = "invalidUser",
            password = "password",
            "device-id",
            "Device name"
        )

        // when
        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(loginUserDTO),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid credentials", response.body?.message)
    }

    @Test
    @Order(5)
    fun loginUser_InvalidPassword() {
        // given
        val loginUserDTO = LoginUserDTO(
            userName = "bob",
            password = "wrongPassword",
            "device-id",
            "Device name"
        )

        // when
        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(loginUserDTO),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid credentials", response.body?.message)
    }

    @Test
    @Order(6)
    fun getSelf_Unauthorized() {
        // when
        val response = restTemplate.exchange(
            "/users/self",
            HttpMethod.GET,
            HttpEntity(null, null),
            UserDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
    }

    @Test
    @Order(7)
    fun getSelf() {
        // given
        val headers = HttpHeaders()
        headers.setBearerAuth(validAccessToken!!)

        // when
        val response = restTemplate.exchange(
            "/users/self",
            HttpMethod.GET,
            HttpEntity(null, headers),
            UserDTO::class.java
        )

        // then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.id)
        assertEquals("bob", response.body?.userName)
        assertEquals("Bob", response.body?.displayName)
        assertEquals(UserRole.USER, response.body?.role)
    }

    @Test
    @Order(8)
    fun refreshSession_ValidRefreshToken() {
        // when
        val response = restTemplate.exchange(
            "/users/session/refresh",
            HttpMethod.POST,
            HttpEntity(UserSessionRefreshDTO(validRefreshToken!!), null),
            AuthDataDTO::class.java
        )

        // then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertTrue(response.body?.accessToken!!.length > 50)
        assertTrue(response.body?.refreshToken!!.length == 128)
        validAccessToken = response.body?.accessToken
        validRefreshToken = response.body?.refreshToken
    }

    @Test
    @Order(9)
    fun getSelf_AfterTokenRefresh() {
        // given
        val headers = HttpHeaders()
        headers.setBearerAuth(validAccessToken!!)

        // when
        val response = restTemplate.exchange(
            "/users/self",
            HttpMethod.GET,
            HttpEntity(null, headers),
            UserDTO::class.java
        )

        // then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.id)
        assertEquals("bob", response.body?.userName)
        assertEquals("Bob", response.body?.displayName)
        assertEquals(UserRole.USER, response.body?.role)
    }

    @Test
    @Order(10)
    fun logout_Unauthorized() {
        // given
        val logoutUserDTO = LogoutUserDTO("bob")

        // when
        val logoutResponse = restTemplate.exchange(
            "/users/logout",
            HttpMethod.POST,
            HttpEntity(logoutUserDTO, null),
            Void::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, logoutResponse.statusCode)
    }

    @Test
    @Order(11)
    fun logout() {
        // given
        val logoutUserDTO = LogoutUserDTO("device-id")
        val headers = HttpHeaders()
        headers.setBearerAuth(validAccessToken!!)

        // when
        val logoutResponse = restTemplate.exchange(
            "/users/logout",
            HttpMethod.POST,
            HttpEntity(logoutUserDTO, headers),
            Void::class.java
        )

        // then
        assertEquals(HttpStatus.NO_CONTENT, logoutResponse.statusCode)
    }

    @Test
    @Order(12)
    fun refreshSession_AfterLogout() {
        // when
        val response = restTemplate.exchange(
            "/users/session/refresh",
            HttpMethod.POST,
            HttpEntity(UserSessionRefreshDTO(validRefreshToken!!), null),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid refresh token", response.body?.message)
    }
}