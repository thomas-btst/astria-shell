import { Levels } from "./windows/levels/levels"
import { PowerMenu } from "./windows/powermenu/Powermenu"

function toggleWindow(args: string[], res: (response: string) => void) {
    if (args.length !== 1) {
        res(`Error: expected 1 argument, received ${args.length.toString()}.\nUsage: astal toggle [window-name]`)
        return
    }
    const windowName = args[0]
    switch (windowName) {
        case "powermenu":
            PowerMenu.toggle()
            break
        default:
            res(`Error: window ${windowName} does not exist`)
            return
    }
    res(`Successfully toggled window "${windowName}"`)
}

function showWindow(args: string[], res: (response: string) => void) {
    if (args.length < 1) {
        res(`Error: expected at least 1 argument, received ${args.length.toString()}.\nUsage: astal show [window-name]`)
        return
    }
    const windowName = args[0]
    switch (windowName) {
        case "level": {
            if (args.length !== 2) {
                res(`Error: expected 2 arg(s), received ${args.length.toString()}\nUsage:\n astal show level [name]`)
                return
            }
            const levelName = args[1]
            const level = Levels.get(levelName)
            if (level) {
                level.show()
            } else {
                res(`Error: Window level ${levelName} not found`)
                return
            }
            break
        }
        default:
            res(`Error: window ${windowName} does not exist`)
            return
    }
    res(`Successfully showed window "${windowName}"`)
}

export function requestHandler(argv: string[], res: (response: string) => void) {
    switch (argv[0]) {
        case "toggle":
            toggleWindow(argv.slice(1), res)
            break
        case "show":
            showWindow(argv.slice(1), res)
            break
        case "help":
            break
        default:
            res("Unknown command")
    }
}
