package com.robin_mayer.volabyte.entity

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.assertNotNull


class FileTest {

    @Test
    fun `test file creation and dto conversion`() {
        // given
        val file = File(
            name = "example.txt",
            isDirectory = false,
            referencedFile = "file123",
            parentDirectoryId = 10L,
            ownerId = "user123"
        )
        file.id = 1L // Simulating ID generation, in a real scenario this would be handled by the database

        // when
        val fileDTO = file.toDTO()

        // then
        assertEquals(1L, file.id) // ID should be generated
        assertEquals("example.txt", fileDTO.name)
        assertFalse(fileDTO.isDirectory)
        assertEquals("file123", fileDTO.referencedFile)
        assertEquals(10L, fileDTO.parentDirectoryId)
    }

}