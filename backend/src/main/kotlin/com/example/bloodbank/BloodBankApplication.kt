package com.example.bloodbank

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class BloodBankApplication

fun main(args: Array<String>) {
    runApplication<BloodBankApplication>(*args)
}
