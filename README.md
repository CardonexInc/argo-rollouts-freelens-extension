# @cardonexinc/argo-rollouts-freelens-extension

## Overview
This extension adds a sidebar item to view and perform actions on Argo Rollouts.

## Configuration
In each cluster's settings page the Argo Rollouts Dashboard URL can be configured. Do not include any part of the path. The deep link to each Rollout page is constructed in the details pane of the Rollout if the URL is provided.

## Build from the source

You can build the extension using this repository.

### Prerequisites

Use [NVM](https://github.com/nvm-sh/nvm) or
[mise-en-place](https://mise.jdx.dev/) or
[windows-nvm](https://github.com/coreybutler/nvm-windows) to install the
required Node.js version.

From the root of this repository:

```sh
nvm install
# or
mise install
# or
winget install CoreyButler.NVMforWindows
nvm install 22.15.1
nvm use 22.15.1
```

Install Pnpm:

```sh
corepack install
# or
curl -fsSL https://get.pnpm.io/install.sh | sh -
# or
winget install pnpm.pnpm
```

### Build extension

```sh
pnpm i
pnpm build
pnpm pack
```

### Install built extension

The tarball for the extension will be placed in the current directory. In
Freelens, navigate to the Extensions list and provide the path to the tarball
to be loaded, or drag and drop the extension tarball into the Freelens window.
After loading for a moment, the extension should appear in the list of enabled
extensions.

## License

The Argo Rollouts logo is a registered trademark of The Linux Foundation and is subject to their [usage policy](https://www.linuxfoundation.org/legal/trademark-usage).

Copyright (c) 2025 Cardonex, Inc.

[MIT License](https://opensource.org/licenses/MIT)