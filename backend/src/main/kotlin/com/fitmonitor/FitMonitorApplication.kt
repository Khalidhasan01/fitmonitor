package com.fitmonitor

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class FitMonitorApplication

fun main(args: Array<String>) {
    runApplication<FitMonitorApplication>(*args)
}
