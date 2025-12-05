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

                // OPCIONES
.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // PÚBLICOS
                .requestMatchers("/", "/login", "/register", "/public/**", "/favicon.ico").permitAll()
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
                .requestMatchers(
                    "/api/pedidos/**",
                    "/api/pedidos",
                    "/api/pedidos/confirmar",
                    "/api/pedidos/usuario/**",
                    "/api/usuarios/mi-perfil",
                    "/api/contacto/mi-historial",
                    "/api/resenas"
                ).authenticated()

                // ADMIN
                .requestMatchers("/api/promociones/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pedidos/todos").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pedidos/**/estado").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/usuarios/todos", "/api/usuarios/modificar/**", "/api/usuarios/eliminar/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/contacto/todos").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pagos/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/dashboard/admin").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/resenas/todas").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/resenas/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/config/qr/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/qr/admin").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/config/garantias/**").hasAuthority("ROLE_Administrador")

                // TODO LO DEMÁS
                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsServiceImpl);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:4200"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}

