package com.camsys.assetcloud.needsforecaster;

import java.util.TimeZone;

import javax.annotation.PostConstruct;

import com.camsys.assetcloud.needsforecaster.dataimport.InitialData;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.DefaultApplicationArguments;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableAsync;

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

	@Autowired
	InitialData initialData;

	/**
	 * Accepted command line argument is "--resetPolicy=true" if you want to clear and reload master policy
	 **/
	@Bean
	public CommandLineRunner startup() {
		return args -> {
			ApplicationArguments appArgs = new DefaultApplicationArguments(args);
			initialData.load(appArgs);
			System.out.println("Database initialized!");
		};
	}
}
