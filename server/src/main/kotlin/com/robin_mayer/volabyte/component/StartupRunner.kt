package com.robin_mayer.volabyte.component

import com.robin_mayer.volabyte.service.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component
import java.nio.file.Paths

@Component
class StartupRunner (
    private val userService: UserService
): CommandLineRunner {

    @Value("\${storage.uploads}")
    private lateinit var uploadDirectory: String

    override fun run(vararg args: String?) {
        generateInitialFolderStructure()
        generateInitialAdmin()
    }

    private fun generateInitialFolderStructure() {
        Paths.get(uploadDirectory).toFile().mkdirs()
    }

    private fun generateInitialAdmin() {
        userService.createInitialAdmin()
    }
}