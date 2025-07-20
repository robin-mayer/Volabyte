package com.robin_mayer.volabyte.security

import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.HttpMethod
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.AuthenticationProvider
import org.springframework.security.authentication.ProviderManager
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.core.Authentication
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration

@Configuration
class SecurityConfig (
    private val jwtAuthenticationFilter: JwtAuthenticationFilter
) {

    @Value("\${frontend.url}")
    lateinit var frontendUrl: String

    @Bean
    fun securityFilterChain(httpSecurity: HttpSecurity): SecurityFilterChain {
        return httpSecurity
            .csrf { it.disable() }
            .cors { it.configurationSource {
                val corsConfiguration = CorsConfiguration()
                corsConfiguration.allowedOrigins = listOf(frontendUrl)
                corsConfiguration.allowedMethods = listOf("GET", "POST", "PATCH", "PUT", "DELETE")
                corsConfiguration.allowedHeaders = listOf("*")
                corsConfiguration.allowCredentials = true
                corsConfiguration
            } }
            .httpBasic { it.disable() }
            .formLogin { it.disable() }
            .exceptionHandling {
                it.authenticationEntryPoint { req, res, _ -> res.sendError(HttpServletResponse.SC_UNAUTHORIZED) }
                it.accessDeniedHandler { req, res, _ -> res.sendError(HttpServletResponse.SC_FORBIDDEN) }
            }
            .authorizeHttpRequests {
                it.requestMatchers(HttpMethod.POST, "/users/login").permitAll()
                it.anyRequest().authenticated()
            }
            .addFilterBefore(
                jwtAuthenticationFilter,
                UsernamePasswordAuthenticationFilter::class.java
            )
            .build()
    }

    @Bean
    fun authenticationManager(): AuthenticationManager {
        val emptyAuthenticationProvider = object : AuthenticationProvider {
            override fun authenticate(authentication: Authentication?): Authentication? {
                return null
            }
            override fun supports(authentication: Class<*>?): Boolean {
                return false
            }
        }
        return ProviderManager(listOf(emptyAuthenticationProvider))
    }
}