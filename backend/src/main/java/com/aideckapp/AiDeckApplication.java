package com.aideckapp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class AiDeckApplication {
    public static void main(String[] args) {
        SpringApplication.run(AiDeckApplication.class, args);
    }
}
