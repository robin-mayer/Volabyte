package com.robin_mayer.volabyte.dto.response

import com.robin_mayer.volabyte.entity.File

data class UploadedChunkDTO (
    val uploadId: String?,
    val uploadedFile: File?
)