{
  pkgs,
  wrappedAgs,
}: let
  shellPkgs = [wrappedAgs pkgs.alejandra pkgs.statix pkgs.deadnix];
in {
  default = pkgs.mkShell {
    nativeBuildInputs = shellPkgs;
  };

  dev = pkgs.mkShell {
    nativeBuildInputs = shellPkgs;

    shellHook = ''
      ags run -d .
    '';
  };

  init = pkgs.mkShell {
    buildInputs = shellPkgs;

    shellHook = ''
      ags types -d ./

      ${pkgs.nodejs}/bin/npm install

      SOURCE="$HOME/.local/share/ags"

      if [ -d "$SOURCE" ]; then
        ln -sfn "$SOURCE" ./node_modules/ags
      fi
    '';
  };
}
