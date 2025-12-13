package com.robin_mayer.volabyte.dto.request

class UploadFileDTO (
    parentId: String?
) {
    val parentId: String? = parentId?.trim()
}