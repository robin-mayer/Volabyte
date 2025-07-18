package com.robin_mayer.volabyte.exception

import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler

@ControllerAdvice
class ApiExceptionHandler {

    @ExceptionHandler(value = [ApiException::class])
    fun handleApiException(apiException: ApiException): ResponseEntity<ApiExceptionDTO> {
        val apiExceptionDTO = ApiExceptionDTO(
            message = apiException.message,
            httpStatus = apiException.httpStatus.value()
        )
        return ResponseEntity(apiExceptionDTO, apiException.httpStatus)
    }
}