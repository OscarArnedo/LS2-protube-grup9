package com.tecnocampus.LS2.protube_back.configuration;

import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.json.JSONArray;
import org.json.JSONObject;
import org.json.JSONTokener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

@Component
public class InitialDataLoader {

    @Value("${pro_tube.load_initial_data}")
    private boolean loadInitialData;

    @Value("${ENV_PROTUBE_STORE_DIR}")
    private String directoryPath;

    private final JdbcTemplate jdbcTemplate;

    public InitialDataLoader(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @EventListener(ContextRefreshedEvent.class)
    public void onApplicationEvent() {
        if (loadInitialData) {
            processJsonFiles(directoryPath);
        }
    }

    private void processJsonFiles(String directoryPath) {
        if(directoryPath.endsWith("/")) directoryPath = directoryPath.substring(0, directoryPath.length() - 1);

        File directory = new File(directoryPath);
        File[] files = directory.listFiles((dir, name) -> name.endsWith(".json"));
        List<CreatedUser> createdUsers = new ArrayList<>();
        int videoCount = 0;

        if (files != null) {
            for (File file : files) {
                try (FileReader reader = new FileReader(file)) {
                    JSONObject videoData = new JSONObject(new JSONTokener(reader));
                    insertVideo(videoData, createdUsers);
                    videoCount++;
                    System.out.println("Processed file: " + file.getName());
                } catch (IOException e) {
                    System.err.println("Error reading file: " + file.getName());
                }
            }
            videoCount++;
            jdbcTemplate.update("ALTER SEQUENCE videos_id_seq RESTART WITH "+videoCount);
        }
    }

    private void insertVideo(JSONObject videoData, List<CreatedUser> createdUsers) {
        String userId = insertUser(videoData.getString("user"), createdUsers);

        int videoId = videoData.getInt("id");
        jdbcTemplate.update("INSERT INTO videos (id, width, height, duration, title, owner_id, image_path, video_path) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
                videoId, videoData.getInt("width"), videoData.getInt("height"), videoData.getInt("duration"), videoData.getString("title"),
                userId, videoId + ".webp", videoId + ".mp4");

        jdbcTemplate.update("INSERT INTO video_meta (video_id, description) VALUES (?, ?)",
                videoId, videoData.getJSONObject("meta").getString("description"));

        JSONArray categories = videoData.getJSONObject("meta").getJSONArray("categories");
        for (int i = 0; i < categories.length(); i++) {
            jdbcTemplate.update("INSERT INTO video_categories (video_id, category) VALUES (?, ?)",
                    videoId, categories.getString(i));
        }

        JSONArray tags = videoData.getJSONObject("meta").getJSONArray("tags");
        for (int i = 0; i < tags.length(); i++) {
            jdbcTemplate.update("INSERT INTO video_tags (video_id, tag) VALUES (?, ?)",
                    videoId, tags.getString(i));
        }

        JSONArray comments = videoData.getJSONObject("meta").getJSONArray("comments");
        for (int i = 0; i < comments.length(); i++) {
            JSONObject comment = comments.getJSONObject(i);
            String commentUserId = insertUser(comment.getString("author"), createdUsers);
            jdbcTemplate.update("INSERT INTO video_comments (video_id, comment_text, comment_author) VALUES (?, ?, ?)",
                    videoId, comment.getString("text"), commentUserId);
        }
    }

    private String insertUser(String author, List<CreatedUser> createdUsers) {
        for (CreatedUser user : createdUsers) {
            if (user.getName().equals(author)) {
                return user.getId();
            }
        }

        String authorFormated = author.replaceAll("\\s", "");
        String email = authorFormated + "@gmail.com";
        List<String> existingUserIds = jdbcTemplate.queryForList("SELECT id FROM users WHERE email = ?", new Object[]{email}, String.class);

        if (!existingUserIds.isEmpty()) {
            String userId = existingUserIds.get(0);
            createdUsers.add(new CreatedUser(userId, author));
            return userId;
        }

        String userId = UUID.randomUUID().toString();
        String password = "$2a$10$fVKfcc47q6lrNbeXangjYeY000dmjdjkdBxEOilqhapuTO5ZH0co2"; //password: password123 (hashed)

        jdbcTemplate.update("INSERT INTO users (id, name, email) VALUES (?, ?, ?)", userId, author, email);
        jdbcTemplate.update("INSERT INTO user_security (username, email, password, role) VALUES (?, ?, ?, ?)", author, email, password, "USER");

        createdUsers.add(new CreatedUser(userId, author));
        return userId;
    }

    private static class CreatedUser {
        private final String id;
        private final String name;

        public CreatedUser(String id, String name) {
            this.id = id;
            this.name = name;
        }

        public String getId() {
            return id;
        }

        public String getName() {
            return name;
        }
    }
}