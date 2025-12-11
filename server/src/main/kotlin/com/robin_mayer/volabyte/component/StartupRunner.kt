package com.robin_mayer.volabyte.component

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
        userService.createInitialAdmin()
    }
}