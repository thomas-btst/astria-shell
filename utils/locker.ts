export class Locker{
    constructor(private lockTime: number) {}

    isLocked = false

    lock(): boolean {
        if (this.isLocked)
            return false
        this.isLocked = true
        Utils.timeout(this.lockTime, () => {
            this.isLocked = false
        })
        return true
    }
}
