import { brightnessIcon } from "windows/bar/modules/tray/brightness/data";
import { Level } from "../level";
import { brightness } from "services/brightness";

export const BrightnessLevel = new Level({
    name: 'brightness',
    icon: brightnessIcon,
    value: brightness.bind('screen_value').as(value => value),
    set: value => brightness.screen_value = value,
})