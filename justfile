# https://just.systems

default:
    just --choose

up: clear
    docker compose up -d --build 

down: clear
    docker compose down

clear:
    clear
