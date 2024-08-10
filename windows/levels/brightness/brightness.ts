import { brightnessIcon } from "windows/bar/modules/tray/brightness/brightness";
import { Level } from "../level";
import { brightness } from "services/brightness";

export const BrightnessLevel = new Level({
    name: 'brightness',
    icon: brightnessIcon,
    value: brightness.bind('screen_value').as(value => value / 100),
    set: value => brightness.screen_value = value * 100,
})