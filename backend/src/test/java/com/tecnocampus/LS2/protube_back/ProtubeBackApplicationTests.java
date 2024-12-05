package com.tecnocampus.LS2.protube_back;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.service.dto.CommentDTO;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoDTO;
import com.tecnocampus.LS2.protube_back.service.dto.VideoUpdateDTO;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.*;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import org.springframework.test.web.servlet.ResultMatcher;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.junit.Assert.assertThrows;
import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.content;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@TestMethodOrder(MethodOrderer.OrderAnnotation.class)
class ProtubeBackApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	@Autowired
	private ObjectMapper objectMapper;
	private static String createdUserId;
	private static String randomName;
	private static String randomEmail;
	private static Long createdCommentId;
	private static Long createdVideoId;
	private final static String password = "password123";

	private String authenticate(String username, String password) throws Exception {
		String body = String.format("{\"username\": \"%s\", \"password\": \"%s\"}", username, password);
		MvcResult result = mockMvc.perform(post("/authenticate")
						.contentType(MediaType.APPLICATION_JSON)
						.content(body))
				.andExpect(status().isOk())
				.andReturn();
		String response = result.getResponse().getContentAsString();
		return objectMapper.readTree(response).get("access_token").asText();
	}

	@BeforeAll
	static void init() {
		randomName = RandomStringUtils.randomAlphabetic(8);
		randomEmail = randomName.toLowerCase() + "@google.com";
	}
	@BeforeEach
	void setUp() throws Exception {
		objectMapper = new ObjectMapper();
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}

	@Test
	@Order(1)
	void getVideos() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/videos")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray())
				.andExpect(jsonPath("$[0].id").exists())
				.andExpect(jsonPath("$[0].title").exists())
				.andExpect(jsonPath("$[0].owner").exists())
				.andExpect(jsonPath("$[0].imagePath").exists());
	}
	@Test
	@Order(2)
	void getVideoById() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/videos/0")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").exists())
				.andExpect(jsonPath("$.title").exists())
				.andExpect(jsonPath("$.height").exists())
				.andExpect(jsonPath("$.width").exists())
				.andExpect(jsonPath("$.duration").exists())
				.andExpect(jsonPath("$.owner.name").exists())
				.andExpect(jsonPath("$.owner.email").exists())
				.andExpect(jsonPath("$.videoPath").exists())
				.andExpect(jsonPath("$.imagePath").exists())
				.andExpect(jsonPath("$.comments").isArray())
				.andExpect(jsonPath("$.description").exists())
				.andExpect(jsonPath("$.tags").isArray())
				.andExpect(jsonPath("$.categories").exists());
	}

	@Test
	@Order(3)
	void createUser() throws Exception {
		String user =  """
                {
                  "name": "%s",
                  "email" : "%s",
                  "password" : "%s"
                }
                """.formatted(randomName, randomEmail,password);
		MvcResult result = mockMvc.perform(post("/api/users/create").contentType("application/json").content(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value(randomName))
				.andExpect(jsonPath("$.email").value(randomEmail))
				.andReturn();

		String content = result.getResponse().getContentAsString();
		UserDTO userDTO = objectMapper.readValue(content, UserDTO.class);
		createdUserId = userDTO.getId();
		System.out.println("Created user id: " + createdUserId);
	}
	@Test
	@Order(4)
	void getVideosByAuthor() throws Exception {
		String token = authenticate(randomName, password);
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/videos/author")
						.header("Authorization", "Bearer " + token)
						.principal(() -> randomName))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		List<VideoDTO> videos = objectMapper.readValue(content, new TypeReference<List<VideoDTO>>() {
		});

		if (!videos.isEmpty()) {
			assertEquals(createdUserId, videos.stream().filter(video -> video.getOwner().equals(createdUserId)).findFirst().get().getOwner());
		} else {
			Assertions.assertTrue(videos.isEmpty());
		}
	}

	@Test
	@Order(5)
	void createComment() throws Exception {
		String comment = """
            {
              "videoId": %d,
              "comment_text": "This is a test comment"
            }
            """.formatted(0);

		String token = authenticate(randomName, password);
		MvcResult result = mockMvc.perform(post("/api/comments")
						.header("Authorization", "Bearer " + token)
						.principal(() -> randomName)
						.contentType(MediaType.APPLICATION_JSON)
						.content(comment))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.comment_text").value("This is a test comment"))
				.andExpect(jsonPath("$.author.id").value(createdUserId))
				.andReturn();

		String content = result.getResponse().getContentAsString();
		CommentDTO commentDTO = objectMapper.readValue(content, CommentDTO.class);
		createdCommentId = commentDTO.getId();
	}

	@Test
	@Order(6)
	void badCreateComment() throws Exception {
		String comment = """
				{
				  "videoId": %d,
				  "comment_text": "This is a test comment"
				}
				""".formatted(2345678);
		String token = authenticate(randomName, password);
		assertThrows(Exception.class, () -> {
			mockMvc.perform(post("/api/comments")
							.header("Authorization", "Bearer " + token)
							.principal(() -> randomName)
							.contentType(MediaType.APPLICATION_JSON)
							.content(comment))
					.andExpect(status().isCreated())
					.andExpect(jsonPath("$.comment_text").value("This is a test comment"))
					.andExpect(jsonPath("$.author.id").value(createdUserId));
		});
	}

	@Test
	@Order(7)
	void updateComment() throws Exception {
		String comment = """
            {
              "text": "This is an updated test comment"
            }
            """;
		String token = authenticate(randomName, password);
		System.out.println("commentId" + createdCommentId);
		mockMvc.perform(MockMvcRequestBuilders.patch("/api/comments/" + createdCommentId + "/text")
						.header("Authorization", "Bearer " + token)
						.principal(() -> randomName)
						.contentType(MediaType.APPLICATION_JSON)
						.content(comment))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.comment_text").value("This is an updated test comment"));
	}

	@Test
	@Order(8)
	void getCommentsByAuthorId() throws Exception {
		String token = authenticate(randomName, password);
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/comments/author")
						.header("Authorization", "Bearer " + token)
						.principal(() -> randomName))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		List<CommentDTO> comments = objectMapper.readValue(content, new TypeReference<List<CommentDTO>>() {
		});

		assertEquals(createdCommentId, comments.stream().filter(comment -> comment.getId().equals(createdCommentId)).findFirst().get().getId());
	}

	@Test
	@Order(9)
	void deleteComment() throws Exception {
		String token = authenticate(randomName, password);
		mockMvc.perform(MockMvcRequestBuilders.delete("/api/comments/" + createdCommentId)
						.principal(() -> randomName)
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk());
	}

	@Test
	@Order(10)
	void badDeleteComment() throws Exception {
		assertThrows(Exception.class, () -> {
			mockMvc.perform(MockMvcRequestBuilders.delete("/api/comments/1235")
						.header("Authorization", "Bearer " + authenticate(randomName, password)))
					.andExpect(status().isNotFound());
		});
	}

	@Test
	@Order(11)
	void getUserById() throws Exception {
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users/"+createdUserId))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		UserDTO userDTO = objectMapper.readValue(content, UserDTO.class);

		assertEquals(randomName, userDTO.getName());
		assertEquals(randomEmail, userDTO.getEmail());
	}

	@Test
	@Order(12)
	void badGetUserById() throws Exception {
		assertThrows(Exception.class, () -> {
			mockMvc.perform(MockMvcRequestBuilders.get("/api/users/1235"))
					.andExpect(status().isNotFound());
		});
	}

	@Test
	@Order(13)
	void getUsers() throws Exception {
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users"))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		List<UserDTO> users = objectMapper.readValue(content, new TypeReference<List<UserDTO>>() {
		});

		assertEquals(createdUserId, users.stream().filter(user -> user.getId().equals(createdUserId)).findFirst().get().getId());
	}

	/*@Test
	@Order(5)
	void updateUser() throws Exception {
		String user = """
    {
      "name": "%s",
      "email" : "%s",
      "password" : "654321"
    }
    """.formatted(randomName, randomEmail);
		mockMvc.perform(MockMvcRequestBuilders.put("/api/users/"+createdUserId).contentType("application/json").content(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value(randomName))
				.andExpect(jsonPath("$.email").value(randomEmail))
				.andExpect(jsonPath("$.password").value("654321"));
	}*/

	@Test
	@Order(14)
	void createVideo() throws Exception {
		String newVideoDTO = """
            {
              "title": "Test Video",
              "description": "Test Description",
              "categories": "Test Category",
              "tags": ["tag1", "tag2"]
            }
            """;

		String token = authenticate(randomName, password);

		MockMultipartFile videoFile = new MockMultipartFile("videoFile", "testVideo.mp4",
				MediaType.MULTIPART_FORM_DATA_VALUE, getClass().getResourceAsStream("/testVideo.mp4"));
		MockMultipartFile imageFile = new MockMultipartFile("imageFile", "testImage.webp",
				MediaType.MULTIPART_FORM_DATA_VALUE, getClass().getResourceAsStream("/testImage.webp"));
		MockMultipartFile newVideoDTOFile = new MockMultipartFile("newVideoDTO", "",
				MediaType.APPLICATION_JSON_VALUE, newVideoDTO.getBytes());

		mockMvc.perform(MockMvcRequestBuilders.multipart("/api/videos")
						.file(videoFile)
						.file(imageFile)
						.file(newVideoDTOFile)
						.header("Authorization", "Bearer " + token)
						.principal(() -> randomName))
						.andExpect(status().isOk())
						.andExpect(MockMvcResultMatchers.content().string("Video created successfully"));

		String result = mockMvc.perform(MockMvcRequestBuilders.get("/api/videos/author")
						.header("Authorization", "Bearer " + token)
						.principal(() -> randomName))
						.andReturn().getResponse().getContentAsString();
		List<VideoDTO> videos = objectMapper.readValue(result, new TypeReference<>() {});
		assertEquals(1, videos.size());
		createdVideoId = videos.get(0).getId();
	}

	@Test
	@Order(15)
	void updateVideo() throws Exception{
		String videoUpdateDTO = """
				{
				  "title": "Updated title",
				  "description": "Updated description"
				}
				""";
		String token = authenticate(randomName, password);
		mockMvc.perform(MockMvcRequestBuilders.put("/api/videos/"+createdVideoId)
						.contentType(MediaType.APPLICATION_JSON)
						.content(videoUpdateDTO)
						.principal(() -> randomName)
						.header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.title").value("Updated title"))
				.andExpect(jsonPath("$.description").value("Updated description"));
	}

	@Test
	@Order(16)
	void deleteVideo() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/api/videos/"+createdVideoId)
						.principal(() -> randomName)
						.header("Authorization", "Bearer " + authenticate(randomName, password)))
				.andExpect(status().isOk());
	}

	@Test
	@Order(17)
	void deleteUser() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/api/users")
						.principal(() -> randomName)
						.header("Authorization", "Bearer " + authenticate(randomName, password)))
				.andExpect(status().isOk());
	}

	@Test
	@Order(18)
	void getCategories() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/videos/categories"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}

	@Test
	@Order(19)
	void getVideosByCategory() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/videos/category/Music"))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$").isArray());
	}
}
