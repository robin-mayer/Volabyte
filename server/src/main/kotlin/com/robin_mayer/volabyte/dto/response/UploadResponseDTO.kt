package com.robin_mayer.volabyte.dto.response

import com.robin_mayer.volabyte.entity.File

data class UploadResponseDTO (
    val fileId: String?,
    val uploadedFile: File?
)