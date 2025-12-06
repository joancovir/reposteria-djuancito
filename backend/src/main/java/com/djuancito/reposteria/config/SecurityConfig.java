package com.djuancito.reposteria.config;

import com.djuancito.reposteria.config.filter.JwtAuthenticationFilter;
import com.djuancito.reposteria.servicio.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
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

    private final UserDetailsServiceImpl userDetailsServiceImpl;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(UserDetailsServiceImpl userDetailsServiceImpl, JwtAuthenticationFilter jwtAuthFilter) {
        this.userDetailsServiceImpl = userDetailsServiceImpl;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ← ESTO ES LO QUE FALTABA – SIRVE TODO EL FRONTEND
                .requestMatchers("/", "/index.html", "/static/**", "/assets/**", "/favicon.ico", "/**/*.js", "/**/*.css", "/**/*.png", "/**/*.jpg").permitAll()

                // OPCIONES
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // PÚBLICOS
                .requestMatchers("/login", "/register").permitAll()
                .requestMatchers("/api/usuarios/login", "/api/usuarios/registro").permitAll()
                .requestMatchers("/api/qr/activos").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/contacto").permitAll()
                .requestMatchers(HttpMethod.GET,
                    "/api/productos/**",
                    "/api/categorias/**",
                    "/api/resenas/**",
                    "/api/promociones/**",
                    "/api/config/**",
                    "/api/confi/**",
                    "/api/productos-realizados",
                    "/api/adicionales",
                    "/api/temporada/**"
                ).permitAll()

                // CLIENTE AUTENTICADO
                .requestMatchers("/api/pedidos/**", "/api/usuarios/mi-perfil").authenticated()

                // ADMIN
                .requestMatchers("/api/promociones/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pedidos/todos", "/api/pedidos/**/estado").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/contacto/todos").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pagos/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/dashboard/admin").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/resenas/todas", "/api/resenas/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/config/qr/**", "/api/qr/admin", "/api/config/garantias/**").hasAuthority("ROLE_Administrador")

                // ← TODAS LAS RUTAS DEL FRONTEND (Angular) → PERMITIDAS
                .anyRequest().permitAll()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // ... el resto igual (authenticationProvider, passwordEncoder, cors, etc.)
}
