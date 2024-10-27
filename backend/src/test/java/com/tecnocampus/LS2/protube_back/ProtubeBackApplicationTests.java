package com.tecnocampus.LS2.protube_back;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import org.apache.commons.lang3.RandomStringUtils;
import org.junit.jupiter.api.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

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

	private static ObjectMapper objectMapper;

	private static String createdUserId;
	private static String randomName;
	private static String randomEmail;
	private static String passwordEncrypted = "$2a$10$fVKfcc47q6lrNbeXangjYeY000dmjdjkdBxEOilqhapuTO5ZH0co2";
	private static String password = "password123";

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
				.andExpect(jsonPath("$[0].username").exists());
	}
	@Test
	@Order(2)
	void getVideoById() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.get("/api/videos/0")
						.accept(MediaType.APPLICATION_JSON))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.id").value(0))
				.andExpect(jsonPath("$.title").value("Bruno Mars - 24K Magic (Official Music Video)"))
				.andExpect(jsonPath("$.height").value(1080))
				.andExpect(jsonPath("$.width").value(1920))
				.andExpect(jsonPath("$.duration").value(24))
				.andExpect(jsonPath("$.owner.id").value("509c436d-e603-4f35-a7c4-95be0c15167a"))
				.andExpect(jsonPath("$.owner.name").value("Bruno Mars"))
				.andExpect(jsonPath("$.owner.email").value("Bruno Mars@gmail.com"));
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
                """.formatted(randomName, randomEmail,passwordEncrypted);
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
	@Order(5)
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
	@Order(6)
	void deleteUser() throws Exception {
		mockMvc.perform(MockMvcRequestBuilders.delete("/api/users/"+createdUserId))
				.andExpect(status().isOk());
	}
}
