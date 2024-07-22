import { Window as Win } from "types/@girs/gtk-3.0/gtk-3.0.cjs";

export interface Window{
    name: string,
    Bar: () => Win,
}

export const margins = 11