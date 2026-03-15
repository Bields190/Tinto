package com.tinto.api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.nio.file.Path;
import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // Pega o caminho absoluto da pasta uploads na raiz do projeto
        String rootPath = System.getProperty("user.dir");
        String uploadPath = Paths.get(rootPath, "uploads").toUri().toString();

        // Mapeia a URL que o Angular usa para a pasta física
        registry.addResourceHandler("/api/fotos/exibir/**")
                .addResourceLocations(uploadPath + "/");
    }
}