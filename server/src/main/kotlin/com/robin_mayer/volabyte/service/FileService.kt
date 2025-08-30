package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.entity.File
import com.robin_mayer.volabyte.exception.ApiException
import com.robin_mayer.volabyte.repository.FileRepository
import org.springframework.http.HttpStatus
import org.springframework.security.core.Authentication
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@Transactional
class FileService (
    private val fileRepository: FileRepository
) {

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
        return fileRepository.findByOwnerIdAndParentIdOrderByName(ownerId, parentId)
    }

    fun createDirectory(
        input: CreateDirectoryDTO,
        authentication: Authentication
    ): File {
        if(input.parentId != null) {
            val parentFile = fileRepository.findByIdAndOwnerId(input.parentId, authentication.name)
                ?: throw ApiException("Parent does not exist", HttpStatus.BAD_REQUEST)
            if (!parentFile.isDirectory) {
                throw ApiException("Parent must be a directory", HttpStatus.BAD_REQUEST)
            }
        }

        val newFile = File(
            name = generateUniqueName(input.parentId, input.name, authentication.name),
            isDirectory = true,
            referencedFile = null,
            parentId = input.parentId,
            ownerId = authentication.name,
        )

        return fileRepository.save(newFile)
    }

    private fun generateUniqueName(
        parentId: String?,
        name: String,
        ownerId: String
    ): String {
        if (
            !fileRepository.existsByOwnerIdAndParentIdAndNameIgnoreCase(
                ownerId,
                parentId,
                name
            )
        ) {
            return name
        }

        var counter = 1
        while (true) {
            val newName = "$name ($counter)"
            if (
                !fileRepository.existsByOwnerIdAndParentIdAndNameIgnoreCase(
                    ownerId,
                    parentId,
                    newName
                )
            ) {
                return newName
            }
            counter++
        }
    }
}