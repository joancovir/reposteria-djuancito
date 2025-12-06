package com.djuancito.reposteria.config;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import org.springframework.web.servlet.resource.PathResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolver;
import org.springframework.web.servlet.resource.ResourceResolverChain;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.util.List;

@Configuration
public class SpaWebFilter implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/**")
                .addResourceLocations("classpath:/static/")
                .resourceChain(true)
                .addResolver(new SpaResourceResolver());
    }

    private static class SpaResourceResolver extends PathResourceResolver {
        @Override
        protected Resource resolveResourceInternal(HttpServletRequest request, String requestPath,
                                                    List<? extends Resource> locations, ResourceResolverChain chain) {
            Resource resource = super.resolveResourceInternal(request, requestPath, locations, chain);
            if (resource != null) {
                return resource;
            }

            // Si no encuentra el archivo → sirve index.html (para rutas de Angular)
            try {
                Resource index = new ClassPathResource("static/index.html");
                if (index.exists() && index.isReadable()) {
                    return index;
                }
            } catch (Exception e) {
                // nada
            }
            return null;
        }

        @Override
        protected String resolveUrlPathInternal(String resourcePath, List<? extends Resource> locations,
                                                 ResourceResolverChain chain) {
            String urlPath = super.resolveUrlPathInternal(resourcePath, locations, chain);
            return urlPath != null ? urlPath : "";
        }
    }
}
