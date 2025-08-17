package com.robin_mayer.volabyte.dto.response

import java.util.Date

data class FileDTO (
    val id: Long,
    val name: String,
    val isDirectory: Boolean,
    val referencedFile: String?,
    val parentDirectoryId: Long?,
    val uploadedAt: Date,
)