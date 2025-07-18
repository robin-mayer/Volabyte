package com.robin_mayer.volabyte.exception

import java.util.Date

data class ApiExceptionDTO (
    val message: String?,
    val httpStatus: Int
) {
    val timestamp = Date()
}