import { Accessor, createComputed } from "ags"
import { execAsync } from "ags/process"
import GLib from "gi://GLib?version=2.0"

interface NotifyProps {
    appName?: string
    icon?: string
    summary: string
    body?: string
    actions?: [string, string][]
    time?: number
}

export namespace Utils {
    export function capitalize(str: string): string {
        return str.slice(0, 1).toUpperCase() + str.slice(1)
    }

    export function compareStringsCaseInsensitive(a?: string, b?: string): boolean {
        return a?.toLowerCase() === b?.toLowerCase()
    }

    export function truncateString(str: string, maxLength: number): string {
        if (str.length > maxLength) return str.slice(0, maxLength) + "..."
        return str
    }

    export function classNames(...args: (string | false | undefined | null)[]) {
        return args.filter(Boolean) as string[]
    }

    export function unnestBinding<T>(nestedBinding: Accessor<Accessor<T>>): Accessor<T> {
        return createComputed((get) => get(get(nestedBinding)))
    }

    export async function notify({
        appName = "Notification",
        icon = "dialog-information-symbolic",
        summary,
        body = "",
        actions = [],
        time,
    }: NotifyProps) {
        const actionParams = actions.map((a) => `--action "${a[0]}=${a[1]}"`).join(" ")
        const timeParam = time ? `-t ${time.toString()}` : ""
        return await execAsync(
            `notify-send "${summary}" "${body}" -a ${appName} -i ${icon} ${actionParams} ${timeParam} -p`,
        )
    }

    export function fileExists(path: string) {
        return GLib.file_test(path, GLib.FileTest.EXISTS)
    }

    export namespace Array {
        export function getElementByRatio<T>(array: readonly T[], ratio: number): T {
            return array[Utils.Number.limitNumberWithinRange(Math.trunc(array.length * ratio), 0, array.length - 1)]
        }

        export function chunkArray<T>(array: readonly T[], size: number) {
            const result = []
            for (let i = 0; i < array.length; i += size) {
                result.push(array.slice(i, i + size))
            }
            return result
        }
    }

    export namespace Number {
        export function withDigits(number: number, digits: number = 2): string {
            return number.toString().padStart(digits, "0")
        }

        export function round(value: number, decimals = 0) {
            const factor = 10 ** decimals
            const v = value * factor
            return Math.round(v) / factor
        }

        export function limitNumberWithinRange(num: number, min: number, max: number): number {
            return Math.max(Math.min(max, num), min)
        }

        export function modulo(num: number, mod: number) {
            return ((num % mod) + mod) % mod
        }
    }
}
