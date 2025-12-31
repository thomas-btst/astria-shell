export class Locker {
    private lockedTime = 0

    get isLocked() {
        return this.lockedTime >= Date.now()
    }

    lock(ms: number) {
        this.lockedTime = Date.now() + ms
    }

    lockIfNotLocked(ms: number): boolean {
        if (this.isLocked) return false
        this.lock(ms)
        return true
    }

    decreaseLock(ms: number) {
        if (!this.isLocked) return
        this.lockedTime -= ms
    }
}
