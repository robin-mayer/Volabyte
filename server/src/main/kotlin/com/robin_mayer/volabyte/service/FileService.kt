package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.dto.request.UploadChunkDTO
import com.robin_mayer.volabyte.dto.response.UploadResponseDTO
import com.robin_mayer.volabyte.entity.File
import com.robin_mayer.volabyte.exception.ApiException
import com.robin_mayer.volabyte.repository.FileRepository
import com.robin_mayer.volabyte.repository.UserRepository
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.HttpStatus
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.web.multipart.MultipartFile
import java.io.IOException
import java.nio.file.Files
import java.nio.file.Paths
import java.nio.file.StandardOpenOption
import java.time.LocalDate
import java.util.Date

@Service
@Transactional(rollbackFor = [IOException::class])
class FileService(
    private val fileRepository: FileRepository,
    private val userRepository: UserRepository
) {

    @Value("\${storage.uploads}")
    private lateinit var uploadDirectory: String

    fun getFiles(
        ownerId: String,
        parentId: String?
    ): List<File> {
        if (parentId != null) {
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
        if (input.parentId != null) {
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
        val ownerIdFetched =
            userRepository.findById(ownerId).orElseThrow { ApiException("User not found", HttpStatus.NOT_FOUND) }.id!!
        val fileName = chunk.originalFilename ?: throw ApiException("Invalid file name", HttpStatus.BAD_REQUEST)

        val file = if (input.fileId != null) {
            fileRepository
                .findByIdAndOwnerId(input.fileId, ownerIdFetched).takeIf { !it?.isDirectory!! && !it.uploadComplete!! }
                ?: throw ApiException("File does not exist", HttpStatus.BAD_REQUEST)
        } else {
            if (input.parentId != null) {
                verifyParentDirectory(input.parentId, ownerId)
            }
            val newFile = fileRepository.save(
                File(
                    generateUniqueName(input.parentId, fileName, ownerId),
                    false,
                    "",
                    input.parentId,
                    ownerIdFetched,
                    false
                )
            )
            val fileExtension = if (fileName.contains(".")) ".${fileName.substringAfter('.')}" else ""
            newFile.referencedFile =
                "/$ownerIdFetched/${LocalDate.now().year.toString().padStart(4, '0')}/${
                    LocalDate.now().monthValue.toString().padStart(2, '0')
                }/${newFile.id!!}$fileExtension"
            fileRepository.save(newFile)
        }

        Paths.get("$uploadDirectory/${file.referencedFile!!.substring(0, 46)}").toFile().mkdirs()
        val uploadFilePath = Paths.get("$uploadDirectory/${file.referencedFile}")
        chunk.inputStream.use { inputStream ->
            Files.newOutputStream(uploadFilePath, StandardOpenOption.CREATE, StandardOpenOption.APPEND).use { output ->
                inputStream.copyTo(output)
            }
        }

        file.uploadedAt = Date()
        if (input.isLastChunk) {
            file.uploadComplete = true
            return UploadResponseDTO(null, fileRepository.save(file))
        } else {
            return UploadResponseDTO(fileRepository.save(file).id, null)
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

    @Scheduled(fixedRate = 1000 * 60 * 30)
    fun deleteIncompleteFiles() {
        val incompleteFiles = fileRepository.findByUploadCompleteIsFalseAndIsDirectoryIsFalse()
        for (file in incompleteFiles) {
            if (file.uploadedAt.before(Date(System.currentTimeMillis() - 1000 * 60 * 60 * 2))) {
                val filePath = Paths.get("$uploadDirectory/${file.referencedFile}")
                Files.deleteIfExists(filePath)
                fileRepository.delete(file)
            }
        }
    }
}