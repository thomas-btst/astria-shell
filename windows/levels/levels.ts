import { Level } from "../../widgets/level/Level"
import { BrightnessLevel } from "./brightness/BrightnessLevel"
import { MicrophoneLevel } from "./microphone/MicrophoneLevel"
import { SpeakerLevel } from "./speaker/SpeakerLevel"

export const Levels: Map<string, Level> = new Map([
    [SpeakerLevel.name, SpeakerLevel],
    [MicrophoneLevel.name, MicrophoneLevel],
    [BrightnessLevel.name, BrightnessLevel],
])
