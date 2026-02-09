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

  # TODO patch astal battery notif bug
  config.programs.ags = mkIf cfg.enable {
    enable = true;

    configDir = ./.;

    # TODOc centralize colors
    extraPackages = with inputs.astal.packages.${system};
      [
        #--- Astal libraries ---
        apps
        battery
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
        alacritty # TODO do not use alacritty or use default terminal instead
        blueman
        btop
        hypridle
        libadwaita
        libnotify
        networkmanager_dmenu
        pavucontrol
        uutils-coreutils-noprefix
        wofi
      ]);
  };
}
