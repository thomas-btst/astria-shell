{
  pkgs,
  agsPkgs,
  extraPackages,
}: let
  ags = agsPkgs.agsFull;
  shellPkgs = [ags pkgs.alejandra pkgs.statix pkgs.deadnix] ++ extraPackages;
in {
  default = pkgs.mkShell {
    buildInputs = shellPkgs;
  };

  dev = pkgs.mkShell {
    buildInputs = shellPkgs;

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
