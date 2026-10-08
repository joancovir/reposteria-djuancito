package com.djuancito.reposteria.controlador;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaForwardController {

    @GetMapping(value = {
        "/{path:[^\\.]*}",
        "/{path1:^(?!api|static|assets).*$}/**/{path2:[^\\.]*}"
    })
    public String forwardSpa(HttpServletRequest request) {
        String uri = request.getRequestURI();
        if (uri.startsWith("/api") || uri.startsWith("/static") || uri.startsWith("/assets")) {
            return null;
        }
        return "forward:/index.html";
    }
}
