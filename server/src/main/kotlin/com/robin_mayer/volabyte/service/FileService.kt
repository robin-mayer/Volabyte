package com.robin_mayer.volabyte.service

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.dto.request.UploadChunkDTO
import com.robin_mayer.volabyte.dto.response.UploadedChunkDTO
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
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardOpenOption
import java.time.LocalDate
import java.time.format.DateTimeFormatter
import java.util.UUID

@Service
@Transactional(rollbackFor = [IOException::class])
class FileService (
    private val fileRepository: FileRepository
) {

    @Value("\${storage.path}")
    private lateinit var storagePath: String
    @Value("\${storage.temp-folder}")
    private lateinit var tempFolder: String
    @Value("\${storage.files-folder}")
    private lateinit var filesFolder: String

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

    fun uploadFileChunk(
        ownerId: String,
        input: UploadChunkDTO,
        chunk: MultipartFile
    ): UploadedChunkDTO {
        val uploadId = sanitizeFileString(input.uploadId ?: UUID.randomUUID().toString())

        val tempUploadPath = Paths.get(String.format("%s/%s/%s", storagePath, tempFolder, uploadId))
        if(!Files.exists(tempUploadPath)) {
            Files.createDirectories(tempUploadPath)
        }

        val chunkIndex = tempUploadPath.toFile().listFiles()?.size
            ?: throw ApiException("Internal server error", HttpStatus.INTERNAL_SERVER_ERROR)
        chunk.inputStream.use { inputStream ->
            Files.newOutputStream(
                tempUploadPath.resolve("chunk_${chunkIndex}.part"),
                StandardOpenOption.CREATE
            ).use { inputStream.copyTo(it) }
        }

        if(input.lastChunk) {
            val referencedFileName = "${UUID.randomUUID()}__${sanitizeFileString(input.fileName)}"
            val finalPath = getUploadDirectory(ownerId)
            val finalFile = finalPath.resolve(referencedFileName)

            val savedFile = fileRepository.save(
                File(
                    generateUniqueName(input.parentId, input.fileName, ownerId),
                    false,
                    finalFile.toString(),
                    input.parentId,
                    ownerId,
                )
            )

            Files.newOutputStream(finalFile, StandardOpenOption.CREATE).use { outputStream ->
                for(i in 0 until chunkIndex + 1) {
                    val chunk = tempUploadPath.resolve("chunk_${i}.part")
                    Files.newInputStream(chunk).use { it.copyTo(outputStream) }
                }
            }

            tempUploadPath.toFile().deleteRecursively()

            return UploadedChunkDTO(
                null,
                savedFile
            )
        }

        return UploadedChunkDTO(
            uploadId,
            null
        )
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

    fun getUploadDirectory(ownerId: String): Path {
        val currentMonthPath = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy/MM"))
        val uploadPath = Paths.get(
            "${storagePath}/${filesFolder}/${sanitizeFileString(ownerId)}/${currentMonthPath}"
        )
        if(!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath)
        }
        return uploadPath
    }
}