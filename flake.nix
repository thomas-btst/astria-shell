{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-26.05";

    ags = {
      url = "github:aylur/ags";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs = {
    nixpkgs,
    ags,
    ...
  }: let
    system = "x86_64-linux"; # TODO import all systems
    agsPkgs = ags.packages.${system};
    pkgs = import nixpkgs {
      inherit system;
    };
    extraPackages = with agsPkgs;
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
    homeModules.default.imports = [
      ags.homeManagerModules.default
      (import ./module.nix extraPackages)
    ];

    devShells.${system} = import ./shell.nix {
      inherit pkgs agsPkgs extraPackages;
    };
  };
}
