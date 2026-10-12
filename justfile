# https://just.systems
# Project & tooling tasks. Node-only scripts (dev, build, start, api:generate)
# live in package.json; recipes here wrap them where other tools are involved.

set unstable
set dotenv-load

image_name := "mozart409/blocky-frontend:latest"

default:
    just --choose

# Start the compose stack (blocky), then the Vite dev server
dev: up
    pnpm dev

up: clear
    podman-compose up -d --build --remove-orphans

down: clear
    podman-compose down

clear:
    clear

# Build the multi-arch image (arm64, amd64)
image:
    podman build --platform linux/arm64,linux/amd64 -t {{ image_name }} .

# Build the amd64-only image (used by the pre-push hook)
image-amd:
    podman build --platform linux/amd64 -t {{ image_name }} .

trivy: clear
    podman build -t blocky_frontend:scan .
    trivy image blocky_frontend:scan

# Format, lint and sort imports
check:
    biome check --write .

# Release: build, bump version + changelog, tag and push (see cog.toml)
bump:
    cog bump --auto --annotated "v{{{{version}}"

update: clear
    git diff --quiet -- flake.lock
    git diff --cached --quiet -- flake.lock
    nix flake update
    if git diff --quiet -- flake.lock; then exit 0; fi
    git add flake.lock
    git commit --only flake.lock -m "chore(deps): update flake inputs"

update-pnpm: clear
    pnpm -r update -i -L
