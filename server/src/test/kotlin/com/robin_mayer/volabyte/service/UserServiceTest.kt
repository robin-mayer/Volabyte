package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.enums.UserRole
import com.robin_mayer.volabyte.exception.ApiException
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.test.annotation.DirtiesContext
import kotlin.test.assertEquals
import kotlin.test.assertTrue

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class UserServiceTest @Autowired constructor(
    private val userService: UserService,
) {

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    fun createUser() {
        // given
        val userName = "testuser"
        val displayName = "Test User"
        val password = "testPassword"
        val role = UserRole.USER

        // when
        val user = userService.createUser(userName, displayName, password, role)

        // then
        assertEquals("testuser", user.userName)
        assertEquals("Test User", user.displayName)
        assertEquals(UserRole.USER, user.role)
    }

    @Test
    fun createUser_UserNameTaken() {
        // given
        val userName = "bob"
        val displayName = "Test User"
        val password = "testPassword"
        val role = UserRole.USER

        try {
            // when
            userService.createUser(userName, displayName, password, role)
        } catch (e: Exception) {
            // then
            assertTrue(e is ApiException)
            assertEquals("Username already exists", e.message)
            assertEquals(HttpStatus.BAD_REQUEST, e.httpStatus)
        }
    }

    @Test
    fun getUser_InvalidUserId() {
        // given
        val userId = "testUserId"

        try {
            // when
            userService.getUser(userId)
        } catch (e: Exception) {
            // then
            assertTrue(e is ApiException)
            assertEquals("User not found", e.message)
            assertEquals(HttpStatus.NOT_FOUND, e.httpStatus)
        }
    }

    @Test
    fun validateUserName() {
        // given
        val userName = "testuser123"

        // when
        val valid = userService.isValidUserName(userName)

        // then
        assertEquals(true, valid)
    }

    @Test
    fun validateUserName_BlankSpace() {
        // given
        val userName = "test User123"

        // when
        val valid = userService.isValidUserName(userName)

        // then
        assertEquals(false, valid)
    }

    @Test
    fun validateUserName_UpperCaseLetter() {
        // given
        val userName = "testUser"

        // when
        val valid = userService.isValidUserName(userName)

        // then
        assertEquals(false, valid)
    }

    @Test
    fun validateUserName_SpecialCharacter() {
        // given
        val userName = "test#User"

        // when
        val valid = userService.isValidUserName(userName)

        // then
        assertEquals(false, valid)
    }
}