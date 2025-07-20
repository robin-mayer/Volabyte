package com.robin_mayer.volabyte.entity

import com.robin_mayer.volabyte.enums.UserRole
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test

class UserTest {

    @Test
    fun `test user creation and dto conversion`() {
        // given
        val user = User(
            "bob",
            "Bob",
            "password123",
            UserRole.USER
        )

        // when
        val userDTO = user.toDTO()

        // then
        assertTrue { user.userId.length == 36 } // UUID length check
        assertEquals(user.userId, userDTO.userId)
        assertEquals("bob", userDTO.userName)
        assertEquals("Bob", userDTO.displayName)
        assertEquals(UserRole.USER, userDTO.role)
    }
}