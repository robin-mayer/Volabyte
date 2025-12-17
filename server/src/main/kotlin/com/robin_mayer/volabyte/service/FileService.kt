package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.dto.request.UploadChunkDTO
import com.robin_mayer.volabyte.dto.response.UploadResponseDTO
import com.robin_mayer.volabyte.entity.File
import com.robin_mayer.volabyte.exception.ApiException
import com.robin_mayer.volabyte.repository.FileRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardOpenOption
import java.time.LocalDate

@Service
@Transactional(rollbackFor = [IOException::class])
class FileService (
    private val fileRepository: FileRepository
) {

    @Value("\${storage.uploads}")
    private lateinit var uploadDirectory: String

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
            null
        )

        return fileRepository.save(newFile)
    }

    fun uploadFileChunk(
        ownerId: String,
        input: UploadChunkDTO,
        chunk: MultipartFile
    ): UploadResponseDTO {
        val fileNameSanitized = sanitizeFileString(input.fileName)
        val ownerIdSanitized = sanitizeFileString(ownerId)
        if(ownerIdSanitized != ownerId) {
            throw ApiException("Invalid owner ID", HttpStatus.BAD_REQUEST)
        }

        val file = if(input.fileId != null) {
            fileRepository
                .findByIdAndOwnerId(input.fileId, ownerId).takeIf { it?.isDirectory!! && it.uploadComplete!! }
                ?: throw ApiException("File does not exist", HttpStatus.BAD_REQUEST)
        } else {
            if(input.parentId != null) {
                verifyParentDirectory(input.parentId, ownerId)
            }
            val newFile = fileRepository.save(
                File(
                    generateUniqueName(input.parentId, input.fileName, ownerId),
                    false,
                    "",
                    input.parentId,
                    ownerId,
                    false
                )
            )
            newFile.referencedFile = "/$ownerIdSanitized/${LocalDate.now().year}/${LocalDate.now().monthValue}/${newFile.id!!}__$fileNameSanitized"
            fileRepository.save(newFile)
        }

        val uploadFolder = Paths.get("$uploadDirectory${file.referencedFile!!.substringBeforeLast('/')}")
        uploadFolder.toFile().mkdirs()

        val filePath = uploadFolder.resolve(file.referencedFile!!.substringAfterLast('/'))

        Files.newOutputStream(filePath).use { outputStream ->
            chunk.inputStream.use { inputStream ->
                Files.newOutputStream(filePath, StandardOpenOption.CREATE, StandardOpenOption.APPEND).use { output ->
                    inputStream.copyTo(output)
                }
            }
        }

        if(input.isLastChunk) {
            file.uploadComplete = true
            return UploadResponseDTO(file.id!!, fileRepository.save(file))
        } else {
            return UploadResponseDTO(file.id!!, null)
        }
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

    fun sanitizeFileString(fileString: String): String {
        return fileString
            .replace("...", "")
            .replace("..", "")
            .replace("/", "")
    }
}