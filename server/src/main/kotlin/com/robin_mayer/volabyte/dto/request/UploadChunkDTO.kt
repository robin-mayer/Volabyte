package com.robin_mayer.volabyte.dto.request

class UploadChunkDTO (
    val parentId: String?,
    val fileId: String?,
    val isLastChunk: Boolean,
    val hash: String,
)