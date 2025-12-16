package com.robin_mayer.volabyte.component

import com.robin_mayer.volabyte.service.UserService
import org.springframework.beans.factory.annotation.Value
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component

@Component
class StartupRunner (
    private val userService: UserService
): CommandLineRunner {

    @Value("\${storage.path}")
    private lateinit var storagePath: String
    @Value("\${storage.temp-folder}")
    private lateinit var tempFolder: String
    @Value("\${storage.files-folder}")
    private lateinit var filesFolder: String

    override fun run(vararg args: String?) {
        generateInitialFolderStructure()
        generateInitialAdmin()
    }

    private fun generateInitialFolderStructure() {
        java.io.File(storagePath, tempFolder).mkdirs()
        java.io.File(storagePath, filesFolder).mkdirs()
    }

    private fun generateInitialAdmin() {
        userService.createInitialAdmin()
    }
}