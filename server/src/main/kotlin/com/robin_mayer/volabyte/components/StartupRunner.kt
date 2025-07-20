package com.robin_mayer.volabyte.components

import com.robin_mayer.volabyte.enums.UserRole
import com.robin_mayer.volabyte.service.UserService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class StartupRunner (
    private val userService: UserService
): CommandLineRunner {

    override fun run(vararg args: String?) {
        generateInitialAdmin()
    }

    private fun generateInitialAdmin() {
        if (!userService.doesUserNameExist("admin")) {
            userService.createUser(
                userName = "admin",
                displayName = "Admin",
                password = "admin",
                role = UserRole.ADMIN
            )
        }
    }
}