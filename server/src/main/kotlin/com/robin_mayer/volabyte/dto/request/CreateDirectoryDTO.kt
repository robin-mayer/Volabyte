package com.robin_mayer.volabyte.dto.request

data class CreateDirectoryDTO (
    val parentId: Long?,
    val name: String
)