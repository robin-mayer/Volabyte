package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.File
import org.springframework.data.jpa.repository.JpaRepository

interface FileRepository: JpaRepository<File, Long> {
    fun findByIdAndOwnerId(id: Long, ownerId: String): File?
    fun existsByParentIdAndOwnerIdAndNameIgnoreCase(parentId: Long?, ownerId: String, name: String): Boolean
}