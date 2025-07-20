package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.enums.UserRole
import org.junit.jupiter.api.Assertions.*
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class JwtServiceTest @Autowired constructor (
    private val jwtService: JwtService,
) {

    @Test
    fun `generate and validate token`() {
        // given
        val userId = "bob"
        val role = UserRole.USER

        // when
        val token = jwtService.generateToken(userId, role)
        val claims = jwtService.validateToken(token)

        // then
        assertFalse { token.isEmpty() }
        assertTrue { token.length > 30 }
        assertEquals("bob", claims!!.subject)
        assertEquals(UserRole.USER.toString(), claims["role"])
        assertTrue(claims.issuedAt != null)
        assertTrue(claims.expiration != null)
    }
}