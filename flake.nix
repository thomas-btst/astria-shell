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
    mkRuntimeDeps = {pkgs}:
      with pkgs; [
        #--- Runtime deps (only on PATH inside the astria-shell wrapper) ---
        noto-fonts
        xdg-terminal-exec
        blueman
        btop
        libnotify
        networkmanager_dmenu
        pavucontrol
        uutils-coreutils-noprefix
      ];
    mkAstalPackages = {
      pkgs,
      agsPkgs,
    }:
      (with agsPkgs; [
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
      ])
      ++ [pkgs.libadwaita];
    mkWrappedAgs = {
      pkgs,
      extraPackages ? [],
    }: let
      agsPkgs = ags.packages.${pkgs.stdenv.hostPlatform.system};
      agsPkg = agsPkgs.default;
      runtimeDeps = mkRuntimeDeps {inherit pkgs;};
    in
      (agsPkg.overrideAttrs
        (prev: {
          nativeBuildInputs = (prev.nativeBuildInputs or []) ++ [pkgs.makeWrapper];
          postInstall =
            (prev.postInstall or "")
            + ''
              wrapProgram $out/bin/ags \
                --prefix PATH : ${nixpkgs.lib.makeBinPath runtimeDeps}
            '';
        })).override {inherit extraPackages;};
  in {
    homeModules.default = {pkgs, ...}: let
      agsPkgs = ags.packages.${pkgs.stdenv.hostPlatform.system};
      wrappedAgs = mkWrappedAgs {inherit pkgs;};
      astalPackages = mkAstalPackages {inherit pkgs agsPkgs;};
    in {
      imports = [
        ags.homeManagerModules.default
        ./module.nix
      ];

      _module.args = {
        inherit wrappedAgs astalPackages;
      };
    };

    devShells = eachSystem (
      system: let
        pkgs = import nixpkgs {
          inherit system;
        };
        agsPkgs = ags.packages.${pkgs.stdenv.hostPlatform.system};
        astalPackages = mkAstalPackages {inherit pkgs agsPkgs;};
      in
        import ./shell.nix {
          inherit pkgs;
          wrappedAgs = mkWrappedAgs {
            inherit pkgs;
            extraPackages = astalPackages;
          };
        }
    );
  };
}
