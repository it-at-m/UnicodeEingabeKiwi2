FROM ghcr.io/ks-no/openshift-nginx/fiks-nginx-openshift:latest

# Copy built KIWI SPA
COPY dist/ /usr/share/nginx/html

LABEL org.opencontainers.image.title="kiwi.muenchen.de"
LABEL org.opencontainers.image.url="https://github.com/it-at-m/UnicodeEingabeKiwi2"