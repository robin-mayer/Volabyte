package com.robin_mayer.volabyte.entity

import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertFalse
import org.junit.jupiter.api.Test
import java.time.Duration
import java.util.Date
import java.util.UUID


class FileTest {

    @Test
    fun `test file creation and dto conversion`() {
        // given
        val id = UUID.randomUUID().toString()
        val parentId = UUID.randomUUID().toString()
        val file = File(
            name = "example.txt",
            isDirectory = false,
            referencedFile = "file123",
            parentId = parentId,
            ownerId = "user123",
            uploadComplete = true
        )
        file.id = id // Simulating ID generation, in a real scenario this would be handled by the database

        // when
        val fileDTO = file.toDTO()

        // then
        assertEquals(id, file.id) // ID should be generated
        assertEquals("example.txt", fileDTO.name)
        assertFalse(fileDTO.isDirectory)
        assertEquals("file123", fileDTO.referencedFile)
        assertEquals(parentId, fileDTO.parentId)
        assertEquals("user123", fileDTO.ownerId)
        val dateDiff = Duration.between(
            fileDTO.uploadedAt.toInstant(),
            Date().toInstant()
        ).abs()
        kotlin.test.assertEquals(true, dateDiff.seconds < 15)
    }

}