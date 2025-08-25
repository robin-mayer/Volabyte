package com.robin_mayer.volabyte.controller

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.dto.response.FileDTO
import com.robin_mayer.volabyte.service.FileService
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.core.Authentication
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
class FileController (
    private val fileService: FileService
) {

    @PostMapping("/files/directories")
    fun createDirectory(
        @RequestBody createDirectoryDTO: CreateDirectoryDTO,
        authentication: Authentication
    ): ResponseEntity<FileDTO> {
        val createdDirectory = fileService.createDirectory(createDirectoryDTO, authentication)
        return ResponseEntity(createdDirectory.toDTO(), HttpStatus.CREATED)
    }
}