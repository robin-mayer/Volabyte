package com.robin_mayer.volabyte.repository

import com.robin_mayer.volabyte.entity.Session
import org.springframework.data.jpa.repository.JpaRepository

interface SessionRepository: JpaRepository<Session, Long>