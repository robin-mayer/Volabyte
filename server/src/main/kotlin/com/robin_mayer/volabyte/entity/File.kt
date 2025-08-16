package com.robin_mayer.volabyte.entity

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
    var referencedFile: String?,
    var parentDirectoryId: Long?,
    var ownerId: String
) {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    var id: Long? = null
    @Suppress("unused")
    val uploadedAt: Date = Date()
}