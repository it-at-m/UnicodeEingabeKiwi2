/*
 * Copyright (c): it@M - Dienstleister für Informations- und Telekommunikationstechnik
 * der Landeshauptstadt München, 2021
 */
package de.muenchen.kiwi.util;

import java.net.URI;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import org.springframework.security.web.server.SecurityWebFilterChain;
import org.springframework.security.web.server.authentication.logout.RedirectServerLogoutSuccessHandler;
import org.springframework.security.web.server.authentication.logout.ServerLogoutSuccessHandler;

/**
 * Utility methods and constants which are used in multiple
 * locations throughout the application.
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class GatewayUtils {

    public static final int ORDER_GLOBAL_FILTER = -3;

    /**
     * This method creates the {@link ServerLogoutSuccessHandler} for handling a successful logout.
     * The usage is necessary in {@link SecurityWebFilterChain}.
     *
     * @param uri to forward after an successful logout.
     * @return The handler for forwarding after an succesful logout.
     */
    public static ServerLogoutSuccessHandler createLogoutSuccessHandler(final String uri) {
        final RedirectServerLogoutSuccessHandler successHandler = new RedirectServerLogoutSuccessHandler();
        successHandler.setLogoutSuccessUrl(URI.create(uri));
        return successHandler;
    }

}

