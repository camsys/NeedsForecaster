package com.camsys.assetcloud.needsforecaster.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;

import java.util.concurrent.Executor;

@Configuration
@EnableAsync
public class AsyncConfig {

    @Bean(name = "sogrRunnerTaskExecutor")
    public Executor sogrRunnerTaskExecutor() {
        // standard thread pool
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(1);//set pool size to 1 to force just one task running at a time
        executor.setMaxPoolSize(1);//set max pool size to 1 to force just one task running at a time
        executor.setQueueCapacity(100);
        executor.setThreadNamePrefix("AsyncThread-");
        executor.initialize();
        return executor;
    }
}
