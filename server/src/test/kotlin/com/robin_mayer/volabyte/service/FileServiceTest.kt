package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.repository.FileRepository
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Test
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
class FileServiceTest @Autowired constructor(
    private val fileService: FileService,
    private val fileRepository: FileRepository
) {

    @Test
    fun generateUniqueName_UniqueDirectory() {
        // given
        val originalName = "Unique name"
        val parentId: String? = null
        val ownerId= "168bc3b2-5286-4572-a0a1-84f2d414f09c"

        // when
        val uniqueName = fileService.generateUniqueName(parentId, originalName, ownerId)

        // then
        assertEquals(originalName, uniqueName)
    }

    @Test
    fun generateUniqueName_UniqueFile() {
        // given
        val originalName = "UniqueFile.txt"
        val parentId: String? = null
        val ownerId= "168bc3b2-5286-4572-a0a1-84f2d414f09c"

        // when
        val uniqueName = fileService.generateUniqueName(parentId, originalName, ownerId)

        // then
        assertEquals(originalName, uniqueName)
    }

    @Test
    fun generateUniqueName_TakenDirectory() {
        // given
        val originalName = "Directory"
        val parentId: String? = null
        val ownerId= "168bc3b2-5286-4572-a0a1-84f2d414f09c"

        // when
        val uniqueName = fileService.generateUniqueName(parentId, originalName, ownerId)

        // then
        assertEquals("$originalName (1)", uniqueName)
    }

    @Test
    fun generateUniqueName_TakenFile() {
        // given
        val originalName = "File.pdf"
        val parentId: String? = null
        val ownerId= "168bc3b2-5286-4572-a0a1-84f2d414f09c"

        // when
        val uniqueName = fileService.generateUniqueName(parentId, originalName, ownerId)

        // then
        assertEquals("File (1).pdf", uniqueName)
    }

    @Test
    fun generateUniqueName_DoubleTakenFile() {
        // given
        val originalName = "File.txt"
        val parentId = "d0bbdf22-60d3-4362-a32e-e275cd12aa86"
        val ownerId= "168bc3b2-5286-4572-a0a1-84f2d414f09c"

        // when
        val uniqueName = fileService.generateUniqueName(parentId, originalName, ownerId)

        // then
        assertEquals("File (2).txt", uniqueName)
    }

   @Test
   fun deleteIncompleteFiles() {
       // given
       val incompleteFile = fileRepository.findById("e24b75ed-1ad3-49cb-8dc2-9079937114fg")
       assertEquals(true, incompleteFile.isPresent)
       assertEquals(false, incompleteFile.get().uploadComplete)

       // when
       fileService.deleteIncompleteFiles()

       // then
        val deletedFile = fileRepository.findById("e24b75ed-1ad3-49cb-8dc2-9079937114fg")
        assertEquals(false, deletedFile.isPresent)
   }
}