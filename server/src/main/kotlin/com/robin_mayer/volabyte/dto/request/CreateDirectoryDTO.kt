package com.robin_mayer.volabyte.dto.request

class CreateDirectoryDTO (
    parentId: String?,
    name: String
) {
    val name: String = name.trim()
    val parentId: String? = parentId?.trim()
}
