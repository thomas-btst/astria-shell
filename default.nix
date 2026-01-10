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

  config.programs.ags = mkIf cfg.enable {
    enable = true;

    configDir = ./.;

    # TODO centralize colors
    # TODO add used pakcages
    extraPackages = with inputs.astal.packages.${system}; [
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
      pkgs.libadwaita
    ];
  };
}
