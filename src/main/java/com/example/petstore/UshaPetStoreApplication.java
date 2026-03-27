package com.example.petstore;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class UshaPetStoreApplication {

    public static void main(String[] args) {
        // This single line launches the entire backend server
        SpringApplication.run(UshaPetStoreApplication.class, args);
        System.out.println("Usha Pet Store Backend is running on http://localhost:8080");
    }
}
