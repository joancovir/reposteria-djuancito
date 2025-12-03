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

                // 1. OPTIONS siempre permitido
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                // 2. ENDPOINTS PÚBLICOS
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

                // 3. ENDPOINTS QUE REQUIEREN AUTENTICACIÓN (cliente o admin)
                .requestMatchers("/api/pedidos/**").authenticated()
                .requestMatchers("/api/usuarios/mi-perfil").authenticated()
                .requestMatchers("/api/contacto/mi-historial").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/resenas").authenticated() 

                // 4. ENDPOINTS SOLO PARA ADMIN
                .requestMatchers("/api/pedidos/todos").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/usuarios/todos").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/usuarios/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/contacto/todos").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pagos/**/estado").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/pagos", "/api/pagos/**").hasAuthority("ROLE_Administrador")  
                .requestMatchers("/api/pedidos/**/estado").hasAuthority("ROLE_Administrador")               
                .requestMatchers("/api/pedidos/**/estado").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/dashboard/admin").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/promociones/todas").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/resenas/todas").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/resenas/**/estado").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/config/qr/**").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/qr/admin").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/config/garantias/admin").hasAuthority("ROLE_Administrador")
                .requestMatchers("/api/config/garantias/**").hasAuthority("ROLE_Administrador")
                // ¡¡¡AL FINAL!!! 
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
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}