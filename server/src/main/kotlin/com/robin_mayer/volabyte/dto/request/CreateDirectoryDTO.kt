package com.robin_mayer.volabyte.dto.request

class CreateDirectoryDTO (
    val parentId: String?,
    name: String
) {
    val name: String = name.trim()
}
