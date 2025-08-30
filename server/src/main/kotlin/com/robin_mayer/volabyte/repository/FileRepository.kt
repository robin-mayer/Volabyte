package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.File
import org.springframework.data.jpa.repository.JpaRepository

interface FileRepository: JpaRepository<File, Long> {
    fun findByIdAndOwnerId(id: String, ownerId: String): File?
    fun existsByOwnerIdAndParentIdAndNameIgnoreCase(ownerId: String, parentId: String?, name: String): Boolean
    fun findByOwnerIdAndParentIdOrderByName(ownerId: String, parentId: String?): List<File>
}