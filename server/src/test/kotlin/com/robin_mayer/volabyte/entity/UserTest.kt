package com.robin_mayer.volabyte.entity

import com.robin_mayer.volabyte.enums.UserRole
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import java.util.UUID

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

        val userId = UUID.randomUUID().toString()
        user.apply { id = userId }

        // when
        val userDTO = user.toDTO()

        // then
        assertEquals(userId, userDTO.id)
        assertEquals("bob", userDTO.userName)
        assertEquals("Bob", userDTO.displayName)
        assertEquals(UserRole.USER, userDTO.role)
    }
}