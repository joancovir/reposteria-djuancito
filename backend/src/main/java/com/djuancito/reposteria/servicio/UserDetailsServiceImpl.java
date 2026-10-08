
package com.djuancito.reposteria.servicio;

import com.djuancito.reposteria.entidad.Usuario;
import com.djuancito.reposteria.repositorio.UsuarioRepositorio;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepositorio usuarioRepositorio;

    public UserDetailsServiceImpl(UsuarioRepositorio usuarioRepositorio) {
        this.usuarioRepositorio = usuarioRepositorio;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // SOLUCIÓN DEFINITIVA AL StackOverflowError
        if ("anonymousUser".equals(username)) {
            return new User("anonymousUser", "", 
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_ANONYMOUS")));
        }

        Usuario usuario = usuarioRepositorio.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado con email: " + username));

        Set<GrantedAuthority> authorities = usuario.getRoles().stream()
            .flatMap(rol -> {
                String nombre = rol.getNombre();
                String conPrefijo = nombre.startsWith("ROLE_") ? nombre : "ROLE_" + nombre;
                String sinPrefijo = nombre.startsWith("ROLE_") ? nombre.substring(5) : nombre;
                return java.util.stream.Stream.of(
                    new SimpleGrantedAuthority(conPrefijo),
                    new SimpleGrantedAuthority(sinPrefijo)
                );
            })
            .collect(Collectors.toSet());

        return new User(usuario.getEmail(), usuario.getPassword(), authorities);
    }
}
