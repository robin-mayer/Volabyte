package com.robin_mayer.volabyte.entity

import com.robin_mayer.volabyte.dto.response.FileDTO
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.Table
import java.util.Date

@Entity
@Table(name = "files")
class File (
    var name: String,
    var isDirectory: Boolean,
    @Column(unique = true)
    var referencedFile: String?,
    var parentId: Long?,
    var ownerId: String
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    @Suppress("unused")
    val uploadedAt: Date = Date()

    fun toDTO(): FileDTO {
        return FileDTO(
            id = id!!,
            name = name,
            isDirectory = isDirectory,
            referencedFile = referencedFile,
            parentId = parentId,
            ownerId = ownerId,
            uploadedAt = uploadedAt
        )
    }
}