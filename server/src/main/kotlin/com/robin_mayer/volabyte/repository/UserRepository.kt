package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.User
import org.springframework.data.jpa.repository.JpaRepository

interface UserRepository: JpaRepository<User, String> {
    fun findByUserName(userName: String): User?
    fun existsByUserName(userName: String): Boolean
}