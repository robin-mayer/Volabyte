package com.robin_mayer.volabyte.dto.request

class UploadChunkDTO (
    fileName: String,
    val parentId: String?,
    val uploadId: String?,
    val lastChunk: Boolean
) {
    val fileName = fileName.trim()
}