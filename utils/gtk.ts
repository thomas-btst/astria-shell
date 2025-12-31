import { Gdk } from "ags/gtk4"

export namespace Cursor {
    export const POINTER = Gdk.Cursor.new_from_name("pointer", null)
    export const DEFAULT = Gdk.Cursor.new_from_name("default", null)
}
