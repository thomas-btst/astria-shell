{
  lib,
  config,
  pkgs,
  inputs,
  system,
  ...
}:
with lib; let
  cfg = config.custom.desktop.ags;
in {
  options.custom.desktop.ags.enable = lib.mkEnableOption "AGS";

  config = mkIf cfg.enable {
    custom.desktop.manager.autostart = [[(getExe config.programs.ags.finalPackage) "run"]];

    programs.ags = {
      enable = true;

      configDir = ./.;

      # TODOc centralize colors
      # TODOf implement menu, popup menu, lock screen and screen manager
      extraPackages = with inputs.astal.packages.${system};
        [
          #--- Astal libraries ---
          apps
          battery #TODO install and setup upower
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
    };
  };
}
