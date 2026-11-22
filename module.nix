{
  lib,
  config,
  options,
  wrappedAgs,
  astalPackages,
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

    programs = {
      # TODOf implement menu, popup menu, lock screen and screen manager
      ags = {
        package = wrappedAgs;

        extraPackages = astalPackages;

        enable = true;

        configDir = ./.;
      };

      astria-shell.finalPackage = config.programs.ags.finalPackage;
    };
  };
}
