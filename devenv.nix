{
  pkgs,
  lib,
  config,
  ...
}: {
  packages = [
    pkgs.nodejs_22
  ];
  # https://devenv.sh/languages/javascript/
  languages.javascript = {
    enable = true;
    pnpm = {
      enable = true;
    };
  };

  # https://devenv.sh/processes/
  processes.start = {
    exec = "podman compose up --build --replace";
  };

  # See full reference at https://devenv.sh/reference/options/
}
