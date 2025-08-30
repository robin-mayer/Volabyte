package com.robin_mayer.volabyte.dto.response

import java.util.Date

data class FileDTO (
    val id: String,
    val name: String,
    val isDirectory: Boolean,
    val referencedFile: String?,
    val parentId: String?,
    val ownerId: String,
    val uploadedAt: Date,
)