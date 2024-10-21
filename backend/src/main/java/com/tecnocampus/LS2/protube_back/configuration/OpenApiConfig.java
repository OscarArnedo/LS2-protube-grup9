package com.tecnocampus.LS2.protube_back.configuration;


import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;
import org.springframework.context.annotation.Configuration;

@Configuration
@OpenAPIDefinition(
        info=@Info(
                title="ProTube API",
                version="1.0.0",
                description = "ProTube API documentation"
        )
)
public class OpenApiConfig {
}
