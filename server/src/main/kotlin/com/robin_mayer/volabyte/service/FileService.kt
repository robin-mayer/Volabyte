package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.entity.File
import com.robin_mayer.volabyte.exception.ApiException
import com.robin_mayer.volabyte.repository.FileRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.io.IOException

@Service
@Transactional(rollbackFor = [IOException::class])
class FileService (
    private val fileRepository: FileRepository
) {

    @Value("\${storage.path}")
    private lateinit var storagePath: String

    fun getFiles(
        ownerId: String,
        parentId: String?
    ): List<File> {
        if(parentId != null) {
            val parentFile = fileRepository.findByIdAndOwnerId(parentId, ownerId)
                ?: throw ApiException("Parent does not exist", HttpStatus.BAD_REQUEST)
            if (!parentFile.isDirectory) {
                throw ApiException("Parent must be a directory", HttpStatus.BAD_REQUEST)
            }
        }
        return fileRepository
            .findByOwnerIdAndParentId(ownerId, parentId)
            .sortedWith(compareBy<File> {
                it.name.replace(" ", "~")
            }.thenBy { it.name })
    }

    fun createDirectory(
        input: CreateDirectoryDTO,
        ownerId: String
    ): File {
        if(input.parentId != null) {
            verifyParentDirectory(input.parentId, ownerId)
        }

        val newFile = File(
            generateUniqueName(input.parentId, input.name, ownerId),
            true,
            null,
            input.parentId,
            ownerId,
        )

        return fileRepository.save(newFile)
    }

    fun verifyParentDirectory(parentId: String, userId: String) {
        val parentFile = fileRepository.findByIdAndOwnerId(parentId, userId)
            ?: throw ApiException("Parent does not exist", HttpStatus.BAD_REQUEST)
        if (!parentFile.isDirectory) {
            throw ApiException("Parent must be a directory", HttpStatus.BAD_REQUEST)
        }
    }

    fun generateUniqueName(
        parentId: String?,
        name: String,
        ownerId: String
    ): String {
        var counter = 0
        while (true) {
            val newName = if (counter == 0) name else {
                val fileNameWithoutExtension = name.substringBefore('.')
                val fileExtension = name.replace(fileNameWithoutExtension, "")
                "$fileNameWithoutExtension ($counter)$fileExtension"
            }
            if (!fileRepository.existsByOwnerIdAndParentIdAndNameIgnoreCase(ownerId, parentId, newName)) {
                return newName
            }
            counter++
        }
    }
}