import GLib from "gi://GLib?version=2.0"
import { DefaultDesktopManager } from "./instances/default_desktop_manager"
import { DesktopManagerInterface } from "./desktop_manager_interface"
import { NiriDesktopManager } from "./instances/niri_desktop_manager"
import { HyrplandDesktopManager } from "./instances/hyprland_desktop_manager"

let instance: DesktopManagerInterface | undefined = undefined

export const DesktopManager = {
    get_default(): DesktopManagerInterface {
        if (!instance) {
            switch (GLib.getenv("XDG_CURRENT_DESKTOP")) {
                case "niri":
                    instance = new NiriDesktopManager()
                    break
                case "Hyprland":
                    instance = new HyrplandDesktopManager()
                    break
                default:
                    instance = new DefaultDesktopManager()
            }
        }

        return instance
    },
}
