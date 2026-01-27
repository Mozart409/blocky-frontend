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
        pkgs = import nixpkgs {inherit system;};
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = with pkgs; [
            nodejs_24
            pnpm
            docker
            lefthook
            ni
            docker-compose
          ];

          shellHook = ''
            echo "Blocky Frontend dev environment loaded"
            echo "Node: $(node --version)"
            echo "pnpm: $(pnpm --version)"
          '';
        };
      }
    );
}
