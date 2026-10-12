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
    git diff --quiet -- flake.lock
    git diff --cached --quiet -- flake.lock
    nix flake update
    if git diff --quiet -- flake.lock; then exit 0; fi
    git add flake.lock
    git commit --only flake.lock -m "chore(deps): update flake inputs"

update-pnpm: clear
    pnpm -r update -i -L
