package com.robin_mayer.volabyte.exception

import org.springframework.http.HttpStatus

class ApiException (
    message: String?,
    val httpStatus: HttpStatus
) : RuntimeException(message)