import Gtk from "types/@girs/gtk-3.0/gtk-3.0";
import { Widget as GtkWidget } from "types/@girs/gtk-3.0/gtk-3.0.cjs";

export function capitalize(str: string): string{
    return str.slice(0,1).toUpperCase() + str.slice(1)
}

export function withDigits(number: number, digits: number = 2): string{
    return number.toString().padStart(digits, '0')
}

export function limitNumberWithinRange(num: number, min: number, max: number): number{
    return Math.max(Math.min(max, num), min)
}

export function modulo(num: number, mod: number) {
    return ((num % mod) + mod) % mod;
}

export const SideBox = (children: {first: GtkWidget, second: GtkWidget, classNames?: string[]}) => {
    children.first.halign = 1
    children.second.halign = 2
    return Widget.Box({
        homogeneous: true,
        classNames: children.classNames ?? [],
        children: [
            children.first,
            children.second,
        ]
    })
}

export interface Section {
    name: string,
    widget: () => GtkWidget,
}

export interface Item extends Section {
    icon: string,
}

export const ComboBoxText = Widget.subclass(Gtk.ComboBoxText)

export type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export type ConstructorParams<T extends new (...args: any) => any> = T extends new (...args: infer P) => any ? P : never;