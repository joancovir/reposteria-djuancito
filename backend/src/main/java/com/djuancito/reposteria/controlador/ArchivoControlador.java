
package com.djuancito.reposteria.controlador;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID; 

@RestController
@RequestMapping("/api/archivos") 
@CrossOrigin(origins = "*") 
public class ArchivoControlador {

    private static final String UPLOAD_DIR = "uploads/images/"; 
    private static final String BASE_URL = "http://localhost:8080/images/"; 

    @PostMapping("/upload") 
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("El archivo está vacío.");
        }
        
        try {
            String fileName = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
            
            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath);

            String fileUrl = BASE_URL + fileName;

            Map<String, String> response = new HashMap<>();
            response.put("url", fileUrl);
            
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Error al subir el archivo: " + e.getMessage());
        }
    }
}