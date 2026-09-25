{
  description = "Mon environnement Nix";

  nixConfig = {
    extra-substituters = [
      "https://ags.cachix.org"
    ];
    extra-trusted-public-keys = [
      "ags.cachix.org-1:naAvMrz0CuYqeyGNyLgE010iUiuf/qx6kYrUv3NwAJ8="
    ];
  };

  inputs = {
    nixpkgs.follows = "ags/nixpkgs";

    ags.url = "github:aylur/ags";
  };

  outputs = {
    nixpkgs,
    ags,
    ...
  }: let
    systems = ["x86_64-linux" "aarch64-linux"];
    eachSystem = nixpkgs.lib.genAttrs systems;
    mkExtraPackages = {
      pkgs,
      agsPkgs,
    }:
      with agsPkgs;
        [
          #--- Astal libraries ---
          apps
          battery #TODOs install and setup upower
          bluetooth
          hyprland
          mpris
          network
          notifd
          powerprofiles
          tray
          wireplumber
        ]
        ++ (with pkgs; [
          #--- Packages ---
          noto-fonts
          xdg-terminal-exec
          blueman
          btop
          libadwaita
          libnotify
          networkmanager_dmenu
          pavucontrol
          uutils-coreutils-noprefix
          wofi
        ]);
  in {
    homeModules.default = {pkgs, ...}: let
      agsPkgs = ags.packages.${pkgs.stdenv.hostPlatform.system};
      extraPackages = mkExtraPackages {inherit pkgs agsPkgs;};
    in {
      imports = [
        ags.homeManagerModules.default
        ./module.nix
      ];

      _module.args = {
        inherit extraPackages;
      };
    };

    devShells = eachSystem (
      system:
        import ./shell.nix rec {
          pkgs = import nixpkgs {
            inherit system;
          };
          agsPkgs = ags.packages.${system};
          extraPackages = mkExtraPackages {
            inherit pkgs agsPkgs;
          };
        }
    );
  };
}
