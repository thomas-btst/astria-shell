# Astria Shell

**Astria Shell** is an elegant desktop shell for **Hyprland** and **Niri**, built with [AGS (Aylur's GTK Shell)](https://github.com/aylur/ags) v2, Astal, GTK4, TypeScript and SCSS.

<p align="center">
  <img src="./assets/preview.png" alt="Astria Shell Preview" width="100%" />
</p>

## Table of Contents

- [Features](#features)
- [Technologies](#technologies)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation with Nix & Home Manager](#installation-with-nix--home-manager)
  - [Development Setup](#development-setup)
- [IPC & Remote Controls](#ipc--remote-controls)
  - [Commands](#commands)
  - [Keybinding Examples](#keybinding-examples)
- [Project Structure](#project-structure)
- [Theming & Customization](#theming--customization)
- [Author](#author)
- [License](#license)

## Features

- **Dynamic Status Bar**
  - **Launcher**: Quick trigger for application launchers (such as Walker / Wofi).
  - **Workspaces**: Native, dynamic workspace indicators tailored for both **Hyprland** and **Niri** (automatically detected via `XDG_CURRENT_DESKTOP`). It can also run on other desktop environments, though the workspaces module will not update dynamically.
  - **Window Title / Info**: Active window name and application class tracker.
  - **System Tray**: Status Notifier Items (SNI) tray support.
  - **Quick Menu & Status Chips**: Audio, WiFi, Ethernet, Bluetooth, Battery, and Idle Inhibit state indicators with an interactive popup menu.
  - **Clock & Date**: Formatted date/time display.

- **On-Screen Display (OSD / Levels)**
  - Interactive on-screen indicators for **Speaker Volume**, **Microphone Volume**, and **Screen Brightness**.
  - Animated popup sliders on value changes with hover persistence and auto-dismissal.

- **Notification Center**
  - Built-in notification daemon and popup system using `AstalNotifd`.
  - Smooth slide animations, action buttons, and automatic dismissals.
  - **Fullscreen Awareness**: Automatically adapts exclusivity and layout when a fullscreen window is active.

- **Power Menu (Session Controls)**
  - Fullscreen overlay modal with session controls: *Shutdown*, *Reboot*, *Logout*, *Lock Screen*, and *Suspend*.
  - Full keyboard navigation support (Arrow keys, Vim keys `h/j/k/l`, `Enter`, and `Escape`).

<p align="center">
  <img src="./assets/preview-powermenu.png" alt="Power Menu Preview" width="100%" />
</p>

- **Background Daemons & Services**
  - **Battery Daemon**: Real-time battery status and low-level alerts.
  - **Brightness Daemon**: Backlight control via sysfs / brightnessctl.
  - **Media Daemon**: Media playback tracker using MPRIS.
  - **Idle Service**: Sleep prevention / idle inhibition management.

- **Modular SCSS Theming**
  - Clean, modern aesthetic with GTK4 CSS styling.
  - Support for multiple color themes (*Dark*, *Light*, *Nordic*).

## Technologies

- **Framework**: [AGS (Astal / GJS)](https://github.com/aylur/ags) + GTK4
- **Language**: TypeScript / TSX
- **Styling**: SCSS
- **Packaging & Environment**: Nix Flakes + Home Manager

## Getting Started

### Prerequisites

- Nix with Flakes enabled (recommended), or a working AGS v2 installation with GTK4 and Astal libraries.
- Wayland compositor: Tailored for [Hyprland](https://hyprland.org/) and [Niri](https://github.com/YaLTeR/niri) (other compositors and desktop environments are supported as well, though the workspaces module will not update).

### Installation with Nix & Home Manager

Astria Shell provides a Home Manager module in `flake.nix`.

1. **Add to your Flake inputs:**

```nix
{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    
    astria-shell = {
      url = "github:thomas-btst/astria-shell";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };
}
```

2. **Import the Home Manager module:**

```nix
{ inputs, ... }: {
  imports = [
    inputs.astria-shell.homeModules.default
  ];

  programs.astria-shell = {
    enable = true;
  };
}
```

### Development Setup

To run Astria Shell locally in a development shell:

1. **Clone the repository:**

```bash
git clone https://github.com/thomas-btst/astria-shell.git
cd astria-shell
```

2. **Initialize TypeScript types and dependencies:**

```bash
nix develop .#init
```

3. **Start the shell:**

```bash
nix develop
```
*(This automatically runs `ags run -d .` inside the development environment)*

4. **Linting and formatting:**

```bash
npm run lint
```

## IPC & Remote Controls

Astria Shell includes an IPC request handler (`request.ts`) allowing you to control windows and OSDs from external scripts, keybindings, or desktop manager configurations.

### Commands

| Action | Command | Description |
| :--- | :--- | :--- |
| **Toggle Power Menu** | `ags request "toggle powermenu"` | Toggles the session power menu overlay |
| **Show Speaker OSD** | `ags request "show level speaker"` | Displays the speaker volume OSD slider |
| **Show Mic OSD** | `ags request "show level microphone"` | Displays the microphone volume OSD slider |
| **Show Brightness OSD** | `ags request "show level brightness"` | Displays the brightness OSD slider |

### Keybinding Examples

#### Hyprland (`hyprland.conf`)

```ini
# Power Menu
bind = $mainMod, Escape, exec, ags request "toggle powermenu"
```

#### Niri (`config.kdl`)

```kdl
binds {
    // Power Menu
    Mod+Escape { spawn "ags" "request" "toggle powermenu"; }
}
```

## Project Structure

```text
astria-shell/
├── app.tsx                 # AGS application entry point
├── request.ts              # IPC CLI request router (toggle, show)
├── flake.nix               # Nix Flake definition
├── module.nix              # Home Manager module integration
├── shell.nix               # Nix development shells (default & init)
├── style.scss              # Root SCSS stylesheet
│
├── daemons/                # Background watchers (Battery, Brightness, Media)
├── services/               # System service abstractions (Audio, Battery, Idle, Desktop)
│   └── desktop_manager/    # Wayland compositor abstraction (Hyprland, Niri)
├── windows/                # Window definitions & overlays
│   ├── bar/                # Top status bar & modules (workspaces, tray, menu, clock)
│   ├── levels/             # OSD levels (speaker, microphone, brightness)
│   ├── notifications/      # Notification popup overlay
│   └── powermenu/          # Fullscreen power & session overlay
├── widgets/                # Reusable UI widgets & overlays
├── style/                  # Modular styles & color palettes (dark, light, nordic)
└── utils/                  # Environment, GTK, and helper utilities
```

## Theming & Customization

- Global environment parameters such as margins and icon sizes can be configured in [`utils/env.ts`](./utils/env.ts) and [`style/env.scss`](./style/env.scss).
- Color schemes are located under [`style/colors/`](./style/colors/).

## Author

- **Name**: Thomas BATISTA
- **Website**: [thomas-batista.fr](https://thomas-batista.fr)

## License

© Thomas BATISTA. All rights reserved.
