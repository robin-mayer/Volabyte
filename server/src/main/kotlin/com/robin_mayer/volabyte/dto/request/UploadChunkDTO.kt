package com.robin_mayer.volabyte.dto.request

class UploadChunkDTO (
    fileName: String,
    val parentId: String?,
    val fileId: String?,
    val isLastChunk: Boolean
) {
    val fileName = fileName.trim()
}