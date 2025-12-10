package com.djuancito.reposteria.config;

import com.djuancito.reposteria.config.filter.JwtAuthenticationFilter;
import com.djuancito.reposteria.servicio.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration; // ← ESTE ES EL BUENO
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List; 
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final UserDetailsServiceImpl userDetailsServiceImpl;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthFilter, UserDetailsServiceImpl userDetailsServiceImpl) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.userDetailsServiceImpl = userDetailsServiceImpl;
    }
@Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsServiceImpl);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }
  @Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
        .csrf(csrf -> csrf.disable())
        .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
        .authorizeHttpRequests(auth -> auth

            // === RECURSOS ESTÁTICOS DEL FRONTEND (Angular) ===
            .requestMatchers(
                "/", "/index.html", "/static/**", "/assets/**", "/favicon.ico",
                "/**/*.js", "/**/*.css", "/**/*.png", "/**/*.jpg", "/**/*.jpeg", 
                "/**/*.svg", "/**/*.ico", "/**/*.json", "/**/*.woff", "/**/*.woff2", "/**/*.ttf"
            ).permitAll()

            // === CORS PREFLIGHT ===
            .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

            // === AUTENTICACIÓN PÚBLICA ===
            .requestMatchers("/api/usuarios/login", "/api/usuarios/registro").permitAll()

            // === ENDPOINTS 100% PÚBLICOS (los que daban 403) ===
            .requestMatchers(HttpMethod.GET,
                "/api/productos/**",
                "/api/categorias/**",
                "/api/resenas",                    // ← este era el que más dolía
                "/api/resenas/**",                 // ← también lo dejamos público para leer
                "/api/promociones/**",
                "/api/promociones/activas",
                "/api/adicionales",                // ← ya no da 403
                "/api/adicionales/**",
                "/api/temporada/activas",          // ← ya carga
                "/api/temporada/**",
                "/api/config/**",
                "/api/config/garantia/**",
                "/api/config/qr/activos",
                "/api/qr/activos",
                "/api/productos-realizados"        // ← ya carga la galería
            ).permitAll()

            // === CONTACTO PÚBLICO (para enviar mensajes) ===
            .requestMatchers(HttpMethod.POST, "/api/contacto").permitAll()

            // === CLIENTE AUTENTICADO (sus pedidos, perfil, historial) ===
            .requestMatchers(
                "/api/pedidos/**",
                "/api/usuarios/mi-perfil",
                "/api/contacto/mi-historial"
            ).authenticated()

            // === SOLO ADMINISTRADOR (todo lo que debe estar protegido) ===
            .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_Administrador")
            .requestMatchers("/api/pedidos/todos", "/api/pedidos/**/estado").hasAuthority("ROLE_Administrador")
            .requestMatchers("/api/contacto/todos").hasAuthority("ROLE_Administrador")
            .requestMatchers("/api/pagos/**").hasAuthority("ROLE_Administrador")
            .requestMatchers("/api/dashboard/admin").hasAuthority("ROLE_Administrador")
            .requestMatchers("/api/resenas/todas").hasAuthority("ROLE_Administrador")  // solo admin ve todas
            .requestMatchers("/api/config/qr/admin", "/api/config/qr/**").hasAuthority("ROLE_Administrador")
            .requestMatchers("/api/config/garantias/**").hasAuthority("ROLE_Administrador")

            // === CUALQUIER OTRA RUTA QUE NO COINCIDA (evita 403 inesperados) ===
            .anyRequest().permitAll()
        )
        .authenticationProvider(authenticationProvider())
        .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("*"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    // ESTE ES EL BEAN QUE FALTABA Y HACÍA QUE TODO FALLE
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }
}
