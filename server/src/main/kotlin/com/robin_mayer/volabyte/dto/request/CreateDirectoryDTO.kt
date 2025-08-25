package com.robin_mayer.volabyte.dto.request

class CreateDirectoryDTO (
    val parentId: Long?,
    name: String
) {
    val name: String = name.trim()
}
