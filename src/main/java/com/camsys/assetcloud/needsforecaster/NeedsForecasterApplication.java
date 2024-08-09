package com.camsys.assetcloud.needsforecaster;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

// disable legacy JPA auto config
@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
@EntityScan(basePackages = {"com.camsys.assetcloud.needsforecaster"})
public class NeedsForecasterApplication {

	@PostConstruct
  	public void init(){
		TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
  	}
	public static void main(String[] args) throws Exception {
		SpringApplication.run(NeedsForecasterApplication.class, args);
	}  
}
