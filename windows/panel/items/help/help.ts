import { Item } from "../items";

const hyprland = await Service.import('hyprland')

interface Bind {
    locked: boolean,
    mouse: boolean,
    release: boolean,
    repeat: boolean,
    non_consuming: boolean,
    has_description: boolean,
    modmask: number,
    submap: string,
    key: string,
    keycode: number,
    catch_all: boolean,
    description: string,
    dispatcher: string,
    arg: string,
}

// interface BindDistinct{
//     has_description: boolean,
//     description: string,

// }

const numbersReplacers: () => [string, string][] = () => [
        'ampersand',
        'eacute',
        'quotedbl',
        'apostrophe',
        'parenleft',
        'minus',
        'egrave',
        'underscore',
        'ccedilla',
        'agrave',
    ].map((key, i) => [key, (i + 1).toString()])

const modReplacers = new Map<string, string>([
    ['Return', 'Retour'],
    ...numbersReplacers(),
    ['mouse:272', 'Click gauche'],
    ['mouse:273', 'Click droit'],
])

const mods = new Array<[string, number]>(
    ['Shift', 4],
    ['Caps', 5],
    ['Ctrl', 2],
    ['Alt', 3],
    ['MOD2', 6],
    ['MOD3', 7],
    ['Win', 1],
    ['MOD5', 8]
).map((key, i) => ({
    key: key[0],
    mask: 1 << i,
    order: key[1],
})).sort((a, b) => a.order - b.order).map(mod => ({
    key: mod.key,
    mask: mod.mask,
}))

const SearchBar = () => Widget.Box({
    className: 'searchbar',
    hpack: 'center',
    spacing: 8,
    children: [
        Widget.Entry({
            placeholderText: 'Rechercher',
            hpack: 'fill',
            vpack: 'center',
        }),
        Widget.Button({
            cursor: 'pointer',
            hpack: 'end',
            label: '',
        })
    ]
})

const Binds = () => {
    const bindKeys = (bind: Bind) => Widget.Box({
            className: 'keys',
            children: mods.filter(mod => (mod.mask & bind.modmask) === mod.mask)
                .map(mod => Widget.Label(mod.key))
                .concat(Widget.Label(modReplacers.get(bind.key) ?? bind.key))
        })

    const bindDescription = (bind: Bind) => Widget.Label({
            hpack: 'start',
            wrap: true,
            label: bind.description
        })

    const binds: Map<string, Bind[]> = JSON.parse(hyprland.message('j/binds'))
        .reduce((map: Map<string, Bind[]>, bind: Bind) => {
            if (!map.has(bind.submap))
                map.set(bind.submap, [])
            map.get(bind.submap)!!.push(bind)
            return map
        }, new Map())
        // .reduce((map: Map<string, Bind[]>, bind: Bind) => {
        //     if (!map.has(bind.description))
        //         map.set(bind.description, [])
        //     map.get(bind.description)!!.push(bind)
        //     return map
        // }, new Map())

    return binds.get('')?.filter((bind: Bind) => bind.has_description)
        .map((bind: Bind) => Widget.FlowBox({
            rowSpacing: 7,
            columnSpacing: 4,
            setup(self) {
                self.add(bindKeys(bind))
                self.add(bindDescription(bind))

                if(bind.dispatcher === 'submap'){
                    self.class_name = 'submap'
                    binds.get(bind.arg)
                        ?.filter(bind => bind.has_description)
                        ?.forEach(bind => {
                            self.add(bindKeys(bind))
                            self.add(bindDescription(bind))
                        })
                }
            },
        })) ?? []
}
export const HelpItem: Item = {
    name: 'Aide',
    icon: '󰘥',
    widget: () => Widget.Box({
        className: 'help',
        vertical: true,
        children: [
            SearchBar(),
            Widget.Box({
                vertical: true,
                children: Binds(),
            }).hook(hyprland, (self, event) => {
                if (event === 'configreloaded')
                    self.children = Binds()
            }, 'event')
        ],
    })
}