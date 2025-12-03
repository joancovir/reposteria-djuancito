package com.djuancito.reposteria;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication(scanBasePackages = "com.djuancito.reposteria") 
public class ReposteriaApplication {

	public static void main(String[] args) {
		SpringApplication.run(ReposteriaApplication.class, args);
	}

}
