package com.robin_mayer.volabyte.dto.request

data class UploadChunkDTO (
    val fileName: String,
    val parentId: String?,
    val uploadId: String?,
    val lastChunk: Boolean
)