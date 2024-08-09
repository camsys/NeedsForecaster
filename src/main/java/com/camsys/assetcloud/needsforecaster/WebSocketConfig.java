package com.camsys.assetcloud.needsforecaster;

import java.util.concurrent.Executor;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
import org.springframework.security.task.DelegatingSecurityContextAsyncTaskExecutor;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
@EnableAsync
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

	@Bean(name = "threadPoolTaskExecutor")
	@Primary
    public Executor threadPoolTaskExecutor() {
        return new ThreadPoolTaskExecutor();
    }
	
	@Bean(name="importPool")
	public DelegatingSecurityContextAsyncTaskExecutor taskExecutor(ThreadPoolTaskExecutor delegate) { 
    	return new DelegatingSecurityContextAsyncTaskExecutor(delegate); 
	}

	@Override
	public void configureMessageBroker(MessageBrokerRegistry config) {
		config.enableSimpleBroker("/topic");
	}

	@Override
	public void registerStompEndpoints(StompEndpointRegistry registry) {
        registry.addEndpoint("/ws-message").setAllowedOriginPatterns("*").withSockJS();
	}
}