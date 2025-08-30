package com.robin_mayer.volabyte.controller

import com.robin_mayer.volabyte.dto.request.LoginUserDTO
import com.robin_mayer.volabyte.dto.response.AuthDataDTO
import com.robin_mayer.volabyte.dto.response.UserDTO
import com.robin_mayer.volabyte.enums.UserRole
import com.robin_mayer.volabyte.exception.ApiExceptionDTO
import com.robin_mayer.volabyte.service.TokenService
import org.junit.jupiter.api.Assertions.assertTrue
import org.junit.jupiter.api.BeforeAll
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
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
class UserControllerTest @Autowired constructor(
    private val tokenService: TokenService
) {

    @Autowired
    private lateinit var restTemplate: TestRestTemplate

    private var accessToken: String? = null

    @BeforeAll
    fun init() {
        accessToken = tokenService.generateAccessToken("168bc3b2-5286-4572-a0a1-84f2d414f09c", UserRole.USER).first
    }

    private fun getHeadersWithAccessToken(): HttpHeaders {
        val headers = HttpHeaders()
        headers.set("Authorization", "Bearer $accessToken")
        return headers
    }


    @Test
    fun loginUser() {
        val loginUserDTO = LoginUserDTO(
            userName = "bob",
            password = "password"
        )

        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(loginUserDTO),
            AuthDataDTO::class.java
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertTrue(response.body?.accessToken!!.length > 50)
    }

    @Test
    fun loginUser_InvalidUserName() {
        val loginUserDTO = LoginUserDTO(
            userName = "invalidUser",
            password = "password"
        )

        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(loginUserDTO),
            ApiExceptionDTO::class.java
        )

        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid credentials", response.body?.message)
    }

    @Test
    fun loginUser_InvalidPassword() {
        val loginUserDTO = LoginUserDTO(
            userName = "bob",
            password = "wrongPassword"
        )

        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(loginUserDTO),
            ApiExceptionDTO::class.java
        )

        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
        assertEquals("Invalid credentials", response.body?.message)
    }

    @Test
    fun getSelf() {
        val response = restTemplate.exchange(
            "/users/self",
            HttpMethod.GET,
            HttpEntity(null, getHeadersWithAccessToken()),
            UserDTO::class.java
        )

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.id)
        assertEquals("bob", response.body?.userName)
        assertEquals("Bob", response.body?.displayName)
        assertEquals(UserRole.USER, response.body?.role)
    }

    @Test
    fun getSelf_Unauthorized() {
        val response = restTemplate.exchange(
            "/users/self",
            HttpMethod.GET,
            HttpEntity(null, null),
            UserDTO::class.java
        )

        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
    }
}