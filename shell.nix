{
  pkgs,
  agsPkgs,
  packages,
}: let
  ags = agsPkgs.agsFull;
  shellPkgs = [ags pkgs.alejandra pkgs.statix pkgs.deadnix] ++ packages;
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
