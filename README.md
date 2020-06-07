# Installer [![Build Status](https://travis-ci.com/panda-lang/installer.svg?branch=master)](https://travis-ci.com/panda-lang/installer)
Install jvm-based version of Panda using a fancy installer. 
The installer downloads the latest version of Panda and creates necessary file associations. 
It also delivers the latest version of JRE used by Panda.

### 🗺️ Downloads
Downloads: [GitHub Releases](https://github.com/panda-lang/installer/releases)

![Preview](https://user-images.githubusercontent.com/4235722/83956943-6781a600-a863-11ea-8b7a-e4f5c4296ef4.png)

### 🧠 Stack and motivations
The first attempts to create the installer have ended in failure.
Languages like Rust and Go didn't have proper tools to offer similar and stable user-friendly environment like Electron.
It's exactly why we've decided to use:
- Node.js
- Electron
- Pug + Tailwindcss

Supported systems:
- [x] Windows
- [ ] Linux
- [ ] macOS
