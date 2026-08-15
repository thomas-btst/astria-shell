extraPackages: {
  lib,
  config,
  options,
  ...
}:
with lib; let
  cfg = config.programs.astria-shell;
in {
  options.programs.astria-shell = {
    enable = lib.mkEnableOption "Astria Shell";
    finalPackage = options.programs.ags.finalPackage;
  };

  config.programs = mkIf cfg.enable {
    # TODOf implement menu, popup menu, lock screen and screen manager
    ags = {
      inherit extraPackages;

      enable = true;

      configDir = ./.;
    };

    astria-shell.finalPackage = config.programs.ags.finalPackage;
  };
}
