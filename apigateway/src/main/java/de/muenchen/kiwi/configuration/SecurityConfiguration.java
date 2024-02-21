/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2021
 */
package de.muenchen.kiwi.configuration;

import java.net.URI;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.web.server.ServerHttpSecurity;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;
import org.springframework.security.web.server.util.matcher.ServerWebExchangeMatchers;

@Configuration
@Profile("!no-security")
public class SecurityConfiguration {

    private static final String LOGOUT_URL = "/logout";
    private static final String LOGOUT_SUCCESS_URL = "/loggedout.html";

    @Bean
    public SecurityWebFilterChain springSecurityFilterChain(ServerHttpSecurity http) {
        http
                // Permit all requests without authentication
                .authorizeExchange()
                .pathMatchers(HttpMethod.OPTIONS, "/api/**").permitAll()
                .pathMatchers(LOGOUT_SUCCESS_URL).permitAll()
                .pathMatchers("/api/*/info",
                              "/actuator/health",
                              "/actuator/info",
                              "/actuator/metrics").permitAll()
                .anyExchange().permitAll()
                .and()
                .csrf().disable() // Optionally disable CSRF if not needed
                .logout()
                .logoutUrl(LOGOUT_URL)
                .logoutSuccessHandler(createLogoutSuccessHandler(LOGOUT_SUCCESS_URL))
                .requiresLogout(ServerWebExchangeMatchers.pathMatchers(HttpMethod.POST, LOGOUT_URL))
                .and()
                .httpBasic().disable() // Disable HTTP Basic authentication
                .formLogin().disable(); // Disable form login

        return http.build();
    }

    /**
     * Creates the ServerLogoutSuccessHandler for handling a successful logout,
     * redirecting to a specified URL after logout.
     *
     * @param uri The URI to redirect to after a successful logout.
     * @return The configured logout success handler.
     */
    public static ServerLogoutSuccessHandler createLogoutSuccessHandler(final String uri) {
        RedirectServerLogoutSuccessHandler successHandler = new RedirectServerLogoutSuccessHandler();
        successHandler.setLogoutSuccessUrl(URI.create(uri));
        return successHandler;
    }

}
