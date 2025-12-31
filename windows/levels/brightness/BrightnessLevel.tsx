import { createBinding } from "ags"
import { Brightness } from "../../../services/brightness_service"
import { Level } from "../../../widgets/level/Level"

const brightness = Brightness.get_default()

export const BrightnessLevel = new Level({
    name: "brightness",
    icon: "display-brightness-symbolic",
    value: createBinding(brightness, "screen"),
    setValue(value) {
        brightness.screen = value
    },
})
