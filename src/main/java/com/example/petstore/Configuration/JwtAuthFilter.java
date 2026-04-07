package com.example.petstore.Configuration;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import jakarta.annotation.PostConstruct;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.Key;
import java.util.Collections;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    // Your secure secret
    private final String jwtSecret = "BoutiquePetStoreSuperSecretKeyThatIsExceedinglyLongAndVerySecure2026!@#$";

    // ✨ Store the key at the class level so it can be reused
    private Key key;

    // ✨ OPTIMIZATION: @PostConstruct runs exactly ONCE when the server starts.
    @PostConstruct
    public void init() {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
        System.out.println("✅ JWT Secure Key initialized successfully.");
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                // ✨ Use the pre-calculated 'this.key' here! This is lightning fast now.
                Claims claims = Jwts.parserBuilder()
                        .setSigningKey(this.key)
                        .build()
                        .parseClaimsJws(token)
                        .getBody();

                String username = claims.getSubject();
                String role = claims.get("role", String.class);

                if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    SimpleGrantedAuthority authority = new SimpleGrantedAuthority(role != null ? role : "CUSTOMER");

                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            username, null, Collections.singletonList(authority));

                    SecurityContextHolder.getContext().setAuthentication(authToken);
                }
            } catch (Exception e) {
                System.out.println("❌ Invalid JWT Token: " + e.getMessage());
            }
        }

        // Continues the chain for both authenticated and public (signup/login) requests
        filterChain.doFilter(request, response);
    }
}