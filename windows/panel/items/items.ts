import { Widget as GtkWidget } from "types/@girs/gtk-3.0/gtk-3.0.cjs";

export interface Section {
    name: string,
    widget: () => GtkWidget,
}

export interface Item extends Section {
    icon: string,
}