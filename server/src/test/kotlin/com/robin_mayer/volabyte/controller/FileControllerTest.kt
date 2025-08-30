package com.robin_mayer.volabyte.controller

import com.robin_mayer.volabyte.dto.request.CreateDirectoryDTO
import com.robin_mayer.volabyte.dto.request.LoginUserDTO
import com.robin_mayer.volabyte.dto.response.AuthDataDTO
import com.robin_mayer.volabyte.dto.response.FileDTO
import com.robin_mayer.volabyte.exception.ApiExceptionDTO
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.TestInstance
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.boot.test.web.client.TestRestTemplate
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.HttpStatus
import org.springframework.test.annotation.DirtiesContext
import java.time.Duration
import java.util.Date
import kotlin.test.assertEquals

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class FileControllerTest {

    @Autowired
    private lateinit var restTemplate: TestRestTemplate

    private fun getHeadersWithAccessToken(): HttpHeaders {
        val headers = HttpHeaders()

        val response = restTemplate.exchange(
            "/users/login",
            HttpMethod.POST,
            HttpEntity(LoginUserDTO("bob", "password")),
            AuthDataDTO::class.java
        )

        headers.set("Authorization", "Bearer ${response.body!!.accessToken}")
        return headers
    }

    @Test
    fun listFiles_NoParent() {
        // given
        val headers = getHeadersWithAccessToken()

        // when
        val response = restTemplate.exchange(
            "/files/list",
            HttpMethod.GET,
            HttpEntity(null, headers),
            Array<FileDTO>::class.java
        )

        // then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(2, response.body?.size)

        assertEquals("d0bbdf22-60d3-4362-a32e-e275cd12aa86", response.body?.get(0)?.id)
        assertEquals("Directory", response.body?.get(0)?.name)
        assertEquals(null, response.body?.get(0)?.parentId)
        assertEquals(true, response.body?.get(0)?.isDirectory)
        assertEquals(null, response.body?.get(0)?.referencedFile)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.get(0)?.ownerId)

        assertEquals("2106bb0e-3429-41ae-84a7-59af82adae87", response.body?.get(1)?.id)
        assertEquals("File.pdf", response.body?.get(1)?.name)
        assertEquals(null, response.body?.get(1)?.parentId)
        assertEquals(false, response.body?.get(1)?.isDirectory)
        assertEquals("/referenced/file.pdf", response.body?.get(1)?.referencedFile)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.get(1)?.ownerId)
    }

    @Test
    fun listFiles_WithParent() {
        // given
        val headers = getHeadersWithAccessToken()

        // when
        val response = restTemplate.exchange(
            "/files/d0bbdf22-60d3-4362-a32e-e275cd12aa86/list",
            HttpMethod.GET,
            HttpEntity(null, headers),
            Array<FileDTO>::class.java
        )

        // then
        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(1, response.body?.size)

        assertEquals("e24b75ed-1ad3-49cb-8dc2-9079937114fd", response.body?.get(0)?.id)
        assertEquals("File.txt", response.body?.get(0)?.name)
        assertEquals("d0bbdf22-60d3-4362-a32e-e275cd12aa86", response.body?.get(0)?.parentId)
        assertEquals(false, response.body?.get(0)?.isDirectory)
        assertEquals("/referenced/file.txt", response.body?.get(0)?.referencedFile)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.get(0)?.ownerId)
    }

    @Test
    fun listFiles_ParentWrong() {
        // given
        val headers = getHeadersWithAccessToken()

        // when
        val response = restTemplate.exchange(
            "/files/random-uuid-id/list",
            HttpMethod.GET,
            HttpEntity(null, headers),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Parent does not exist", response.body?.message)
    }

    @Test
    fun listFiles_ParentDoesBelongToOtherUser() {
        // given
        val headers = getHeadersWithAccessToken()

        // when
        val response = restTemplate.exchange(
            "/files/e903be49-d43a-4e52-96af-c69dc7e6ebfd/list",
            HttpMethod.GET,
            HttpEntity(null, headers),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Parent does not exist", response.body?.message)
    }

    @Test
    fun listFiles_ParentIsFile() {
        // given
        val headers = getHeadersWithAccessToken()

        // when
        val response = restTemplate.exchange(
            "/files/2106bb0e-3429-41ae-84a7-59af82adae87/list",
            HttpMethod.GET,
            HttpEntity(null, headers),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Parent must be a directory", response.body?.message)
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    fun createDirectory_NoParent() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "test-directory",
            parentId = null
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, getHeadersWithAccessToken()),
            FileDTO::class.java
        )

        // then
        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals("test-directory", response.body?.name)
        assertEquals(null, response.body?.parentId)
        assertEquals(true, response.body?.isDirectory)
        assertEquals(null, response.body?.referencedFile)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.ownerId)
        val dateDiff = Duration.between(
            response.body?.uploadedAt?.toInstant(),
            Date().toInstant()
        ).abs()
        assertEquals(true, dateDiff.seconds < 15)
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    fun createDirectory_NoParentDoubleName() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "directory",
            parentId = null
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, getHeadersWithAccessToken()),
            FileDTO::class.java
        )

        // then
        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals("directory (1)", response.body?.name)
        assertEquals(null, response.body?.parentId)
        assertEquals(true, response.body?.isDirectory)
        assertEquals(null, response.body?.referencedFile)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.ownerId)
        val dateDiff = Duration.between(
            response.body?.uploadedAt?.toInstant(),
            Date().toInstant()
        ).abs()
        assertEquals(true, dateDiff.seconds < 15)
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    fun createDirectory_WithParent() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "test-directory-with-parent",
            parentId = "d0bbdf22-60d3-4362-a32e-e275cd12aa86"
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, getHeadersWithAccessToken()),
            FileDTO::class.java
        )

        // then
        assertEquals(HttpStatus.CREATED, response.statusCode)
        assertEquals("test-directory-with-parent", response.body?.name)
        assertEquals("d0bbdf22-60d3-4362-a32e-e275cd12aa86", response.body?.parentId)
        assertEquals(true, response.body?.isDirectory)
        assertEquals(null, response.body?.referencedFile)
        assertEquals("168bc3b2-5286-4572-a0a1-84f2d414f09c", response.body?.ownerId)
        val dateDiff = Duration.between(
            response.body?.uploadedAt?.toInstant(),
            Date().toInstant()
        ).abs()
        assertEquals(true, dateDiff.seconds < 15)
    }

    @Test
    fun createDirectory_ParentIsFile() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "test-directory-with-file-parent",
            parentId = "2106bb0e-3429-41ae-84a7-59af82adae87"
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, getHeadersWithAccessToken()),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Parent must be a directory", response.body?.message)
    }

    @Test
    fun createDirectory_ParentDoesNotExists() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "test-directory-with-invalid-parent",
            parentId = "random_uuid"
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, getHeadersWithAccessToken()),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Parent does not exist", response.body?.message)
    }

    @Test
    fun createDirectory_ParentDoesBelongToSomeoneElse() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "test-directory-with-invalid-parent",
            parentId = "e903be49-d43a-4e52-96af-c69dc7e6ebfd"
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, getHeadersWithAccessToken()),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.BAD_REQUEST, response.statusCode)
        assertEquals("Parent does not exist", response.body?.message)
    }

    @Test
    fun createDirectory_WithoutAccessToken() {
        // given
        val createDirectoryDTO = CreateDirectoryDTO(
            name = "test-directory-without-access-token",
            parentId = null
        )

        // when
        val response = restTemplate.exchange(
            "/files/directories",
            HttpMethod.POST,
            HttpEntity(createDirectoryDTO, null),
            ApiExceptionDTO::class.java
        )

        // then
        assertEquals(HttpStatus.UNAUTHORIZED, response.statusCode)
    }

}