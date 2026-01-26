package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.File
import org.springframework.data.jpa.repository.JpaRepository

interface FileRepository: JpaRepository<File, String> {
    fun findByIdAndOwnerId(id: String, ownerId: String): File?
    fun existsByOwnerIdAndParentIdAndNameIgnoreCase(ownerId: String, parentId: String?, name: String): Boolean
    fun findByOwnerIdAndParentId(ownerId: String, parentId: String?): List<File>
    fun findByUploadCompleteIsFalseAndIsDirectoryIsFalse(): List<File>
}