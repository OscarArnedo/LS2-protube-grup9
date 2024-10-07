package com.tecnocampus.LS2.protube_back.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.io.File;
import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

@Service
public class VideoService {
    public List<String> getVideos(){
        List<String> videoTitles = new ArrayList<>();
        String folderPath = System.getenv("ENV_PROTUBE_STORE_DIR");

        if (folderPath == null) throw new RuntimeException("La variable de entorno 'ENV_PROTUBE_STORE_DIR' no está configurada");

        // Crear un objeto File para representar la carpeta
        File carpeta = new File(folderPath);

        if (!carpeta.exists() || !carpeta.isDirectory()) throw new RuntimeException("La carpeta no existe o no es un directorio válido");

        // Procesar los archivos JSON en la carpeta
        File[] files = carpeta.listFiles((dir, name) -> name.endsWith(".json"));

        ObjectMapper objectMapper = new ObjectMapper();
        if (files != null && files.length > 0) {
            for (File file : files) {
                System.out.println("Procesando archivo: " + file.getName());
                try {
                    // Leer el contenido del archivo JSON
                    Path path = Paths.get(file.getAbsolutePath());
                    JsonNode jsonNode = objectMapper.readTree(path.toFile());

                    if (jsonNode.has("title")) {
                        String title = jsonNode.get("title").asText();
                        videoTitles.add(title);
                    } else {
                        System.out.println("El archivo JSON no contiene el campo 'title'.");
                    }
                } catch (IOException e) {
                    System.out.println("Error al leer el archivo: " + file.getName());
                    e.printStackTrace();
                }
            }
        } else {
            System.out.println("No se encontraron archivos JSON en la carpeta");
        }
        return videoTitles;
    }
}
