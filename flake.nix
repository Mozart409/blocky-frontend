{
  description = "Blocky Frontend development environment";
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = {
    self,
    nixpkgs,
    flake-utils,
  }:
    flake-utils.lib.eachDefaultSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
          config = {
            allowUnfree = true;
          };
        };
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            # keep-sorted start
            actionlint
            biome
            claude-code
            cocogitto
            git
            gitleaks
            keep-sorted
            lefthook
            ni
            nodejs_24
            opencode
            pnpm
            podman
            podman-compose
            trivy
            # keep-sorted end
          ];

          shellHook = ''
            lefthook install
            echo "Blocky Frontend dev environment loaded"
            echo "Node: $(node --version)"
            echo "pnpm: $(pnpm --version)"
          '';
        };
      }
    );
}
