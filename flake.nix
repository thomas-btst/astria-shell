{
  inputs = {
    main-config.url = "path:../../..";

    nixpkgs.follows = "main-config/nixpkgs";
    ags.follows = "main-config/ags";
  };

  outputs = {
    nixpkgs,
    ags,
    ...
  }: let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
  in {
    devShells.${system}.default = pkgs.mkShell {
      buildInputs = [ags.packages.${system}.default];

      shellHook = ''
        ags types -d ./

        ${pkgs.nodejs}/bin/npm install

        SOURCE="$HOME/.local/share/ags"

        if [ -d "$SOURCE" ]; then
           ln -sfn "$SOURCE" ./node_modules/ags
        fi
      '';
    };
  };
}
