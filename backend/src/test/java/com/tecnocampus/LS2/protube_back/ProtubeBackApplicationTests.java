package com.tecnocampus.LS2.protube_back;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecnocampus.LS2.protube_back.service.dto.UserDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.thymeleaf.spring6.expression.Mvc;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class ProtubeBackApplicationTests {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private WebApplicationContext webApplicationContext;

	private static ObjectMapper objectMapper;

	@BeforeEach
	void setUp() throws Exception {
		objectMapper = new ObjectMapper();
		mockMvc = MockMvcBuilders.webAppContextSetup(webApplicationContext).build();
	}

	@Test
	void contextLoads() {
	}

	@Test
	void getVideos() throws Exception {
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/videos"))
				.andExpect(status().isOk())
				.andReturn();

		String content = result.getResponse().getContentAsString();
		List<String> videos = objectMapper.readValue(content, new TypeReference<List<String>>() {});

		assertEquals("Bruno Mars - 24K Magic (Official Music Video)", videos.get(0));
	}
	@Test
	void createUser() throws Exception {
		String user =  """
                {
                  "name": "Luis",
                  "email" : "lacostas@edu.tecnocampus.cat",
                  "password" : "123456"
                }
                """;
		mockMvc.perform(post("/api/users/create").contentType("application/json").content(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Luis"))
				.andExpect(jsonPath("$.email").value("lacostas@edu.tecnocampus.cat"))
				.andExpect(jsonPath("$.password").value("123456"));

	}
	@Test
	void getUserById() throws Exception {
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users/46ad381a-3134-4e18-8039-85f2fee184f1"))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		UserDTO userDTO = objectMapper.readValue(content, UserDTO.class);

		assertEquals("Luis", userDTO.getName());
		assertEquals("lacostas@edu.tecnocampus.cat", userDTO.getEmail());
		assertEquals("123456", userDTO.getPassword());
	}
	@Test
	void getUsers() throws Exception {
		MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/users"))
				.andExpect(status().isOk())
				.andReturn();
		String content = result.getResponse().getContentAsString();
		List<UserDTO> users = objectMapper.readValue(content, new TypeReference<List<UserDTO>>() {
		});

		assertEquals("46ad381a-3134-4e18-8039-85f2fee184f1", users.get(0).getId());
	}
	@Test
	void updateUser() throws Exception {
		String user = """
				{
				  "name": "Luis",
				  "email" : "lacostas@edu.tecnocampus.cat",
				  "password" : "123456"
				}
				""";
		mockMvc.perform(MockMvcRequestBuilders.put("/api/users/46ad381a-3134-4e18-8039-85f2fee184f1").contentType("application/json").content(user))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.name").value("Luis"))
				.andExpect(jsonPath("$.email").value("lacostas@edu.tecnocampus.cat"))
				.andExpect(jsonPath("$.password").value("123456"));
	}
}
