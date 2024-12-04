package com.tecnocampus.LS2.protube_back.security.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import static org.springframework.http.HttpMethod.*;
import static org.springframework.http.HttpMethod.GET;
import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration implements WebMvcConfigurer {
    private static final String[] WHITE_LIST_URL = {
            "/",
            "/api/videos",
            "/api/videos/category/**",
            "/api/videos/categories",
            "/api/videos/{id}",
            "/authenticate",
            "/swagger-resources",
            "/swagger-resources/**",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html",
            "/v3/api-docs/**",
            "/assets/**",
            "/api/users/create",
            "/media/**",
            "/video/**",
            "/profile",
            "/index.html"
        };

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("http://localhost:5173")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    public SecurityConfiguration(JwtAuthenticationFilter jwtAuthFilter, AuthenticationProvider authenticationProvider) {
        this.jwtAuthFilter = jwtAuthFilter;
        this.authenticationProvider = authenticationProvider;
    }

    /* At this moment I'm not able to have the h2-console working with the security. So, I disabled the
    console in the -h2-memory.properties file
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // .headers(headers -> headers.frameOptions(frameOptions -> frameOptions
                //         .sameOrigin()))
                // .csrf(csrf -> csrf
                //         .ignoringRequestMatchers(PathRequest.toH2Console()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(req ->
                        req.requestMatchers(WHITE_LIST_URL)
                                .permitAll()
                                //.requestMatchers( "/**").hasAnyRole("ADMIN")
                                .requestMatchers(POST,"/authenticate").permitAll()
                                .requestMatchers(POST,"/api/user/create").permitAll()
                                .requestMatchers(PUT,"/api/videos/{id}").permitAll()
                                .requestMatchers(POST, "/api/comments/create").permitAll()
                                .requestMatchers(PATCH, "/api/comments/{commentId}/text").permitAll()
                                .requestMatchers(DELETE, "/api/comments/delete/{id}").permitAll()
                                .requestMatchers(GET, "/api/users/userDetails").permitAll()
                                .requestMatchers(POST, "/api/videos").permitAll()
                                .requestMatchers(DELETE, "/api/videos/{id}").permitAll()
                                .anyRequest()
                                .authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(STATELESS))
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
