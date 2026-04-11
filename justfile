# https://just.systems

default:
    just --choose

up: clear
    docker compose up -d --build 

down: clear
    docker compose down

clear:
    clear

trivy: clear
    docker build -t blocky_frontend:scan .
    trivy image blocky_frontend:scan

update: clear
    pnpm -r update -i -L
