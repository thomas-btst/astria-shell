wall="~/Images/wallpaper/background"

(
hyprctl hyprpaper unload "$wall"
hyprctl hyprpaper preload "$wall"
hyprctl hyprpaper wallpaper ",$wall"
) > /dev/null
