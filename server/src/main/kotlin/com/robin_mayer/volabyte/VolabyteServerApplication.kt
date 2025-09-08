package com.robin_mayer.volabyte

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.scheduling.annotation.EnableScheduling

@SpringBootApplication
@EnableScheduling
class VolabyteServerApplication

fun main(args: Array<String>) {
	runApplication<VolabyteServerApplication>(*args)
}
