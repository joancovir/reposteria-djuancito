
package com.djuancito.reposteria.config.filter;

import com.djuancito.reposteria.servicio.JwtServicio;
import com.djuancito.reposteria.servicio.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtServicio jwtServicio;
    private final UserDetailsServiceImpl userDetailsService;

    public JwtAuthenticationFilter(JwtServicio jwtServicio, UserDetailsServiceImpl userDetailsService) {
        this.jwtServicio = jwtServicio;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        final String jwt;
        final String userEmail;

        log.info("Procesando petición para URI: {}", request.getRequestURI());

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            log.info("No se encontró cabecera Authorization Bearer. Pasando al siguiente filtro.");
            filterChain.doFilter(request, response);
            return;
        }

        jwt = authHeader.substring(7);

        try {
            userEmail = jwtServicio.extractUsername(jwt);

             // --- LOGGING: Email extraído ---
            log.info("Email extraído del token: {}", userEmail);

            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                log.info("Usuario no autenticado en contexto. Cargando UserDetails...");
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);

                // --- LOGGING: Roles/Authorities cargados ---
                log.info("UserDetails cargado para {}. Authorities: {}", userEmail, userDetails.getAuthorities());

                if (jwtServicio.isTokenValid(jwt, userDetails)) {
                    log.info("Token válido para {}. Creando AuthenticationToken...", userEmail);
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null, 
                            userDetails.getAuthorities() // <-- Pasamos las authorities
                    );
                    authToken.setDetails(
                            new WebAuthenticationDetailsSource().buildDetails(request)
                    );

                    // --- LOGGING: AuthenticationToken creado ---
                     log.info("AuthenticationToken creado. Authorities en token: {}", authToken.getAuthorities());

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    log.info("Authentication establecida en SecurityContext para {}", userEmail);

                } else {
                    log.warn("Token inválido para {}", userEmail);
                }
            } else {
                 if (userEmail == null) log.warn("No se pudo extraer email del token.");
                 if (SecurityContextHolder.getContext().getAuthentication() != null) log.info("Usuario ya autenticado en contexto: {}", userEmail);
            }
            
            filterChain.doFilter(request, response);
            
        } catch (Exception e) {
            log.error("Error al procesar el token JWT: {}", e.getMessage(), e); 
            
             filterChain.doFilter(request, response);
        }
    }
}