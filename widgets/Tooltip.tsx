export function Tooltip() {
    return (
        <popover
            $={(self) =>
                setTimeout(() => {
                    self.popup()
                }, 3000)
            }
        >
            test
        </popover>
    )
} // TODO
