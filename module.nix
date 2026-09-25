{
  lib,
  pkgs,
  packages,
  config,
  options,
  agsPkgs,
  ...
}:
with lib; let
  cfg = config.programs.astria-shell;
in {
  options.programs.astria-shell = {
    enable = lib.mkEnableOption "Astria Shell";
    finalPackage = options.programs.ags.finalPackage;
  };

  config = mkIf cfg.enable {
    fonts.fontconfig.enable = lib.mkDefault true;

    home = {inherit packages;};

    programs = {
      # TODOf implement menu, popup menu, lock screen and screen manager
      ags = {
        extraPackages =
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
          ++ [
            pkgs.libadwaita
          ];

        enable = true;

        configDir = ./.;
      };

      astria-shell.finalPackage = config.programs.ags.finalPackage;
    };
  };
}
