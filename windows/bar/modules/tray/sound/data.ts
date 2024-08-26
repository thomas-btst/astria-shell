export interface SoundIcon{
    normal: string,
    muted: string,
}

export const soundIcons: {
    default: SoundIcon,
    headphones: SoundIcon,
} = {
    default: {
        normal: '󰕾',
        muted: '󰖁'
    },
    headphones: {
        normal: '󰋋',
        muted: '󰟎'
    }
}