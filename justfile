# https://just.systems

set unstable
set dotenv-load

default:
    just --choose

up: clear
    podman-compose up -d --build 

down: clear
    podman-compose down

clear:
    clear

trivy: clear
    podman build -t blocky_frontend:scan .
    trivy image blocky_frontend:scan

update: clear
    pnpm -r update -i -L
