{
  pkgs,
  agsPkgs,
  extraPackages,
}: let
  ags = agsPkgs.agsFull;
in {
  default = pkgs.mkShell {
    buildInputs = [ags] ++ extraPackages;

    shellHook = ''
      ags run -d .
    '';
  };

  init = pkgs.mkShell {
    buildInputs = [ags];

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
