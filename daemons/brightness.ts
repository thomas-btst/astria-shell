import { Brightness } from "../services/brightness_service"

const brightness = Brightness.get_default()

export const BrightnessDaemon = () => {
    brightness.connect("notify::screen", ({ screen }) => {
        if (screen <= 0) brightness.screen = 0.01
    })
}
