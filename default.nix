{
  pkgs,
  inputs,
  system,
  ...
}: {
  programs.ags = {
    enable = true;
    configDir = ./.;
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
