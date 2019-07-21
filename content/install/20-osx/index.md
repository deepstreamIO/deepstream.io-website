---
title: Installing on OSX
description: Find out how to get deepstream running on OSX
installImage: osx.png
---

Download the latest server artifact [deepstream.io-mac-VERSION.zip](https://github.com/deepstreamIO/deepstream.io/releases) and unzip it.

## Starting deepstream
You can start the server via command line

```bash
./deepstream start
```

Learn more about deepstream's [command line interface](/docs/server/command-line-interface/) and its [configuration file](/docs/server/configuration/).

## Homebrew

[[info]]
| Homebrew is not yet up to date with the V4 version. If you are able to help update it please reach out!


The only dependency you need is to install Homebrew, a popular package manager for macOS. If you don't already have it installed, you can install it via:

```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

To install deepstream, simply run the command into your terminal

```bash
brew cask install deepstream
```

Resulting in

```bash
==> Downloading https://github.com/deepstreamIO/deepstream.io/releases/download/v2.4.0/deepstream.io-mac-2.4.0.pkg
######################################################################## 100.0%
==> Verifying checksum for Cask deepstream
==> Installing Cask deepstream
==> Running installer for deepstream; your password may be necessary.
==> Package installers may write to any location; options such as --appdir are ignored.
Password:
==> installer: Package name is deepstream.io-mac-2.4.0
==> installer: Upgrading at base path /
==> installer: The upgrade was successful.
🍺  deepstream was successfully installed!
```

## Starting deepstream
deepstream can be started via its [command line interface](/docs/server/command-line-interface/).

```bash
deepstream start
```

![Starting deepstream on osx](./brew-start.png)

### Configuring deepstream
You can either change deepstream's [configuration file](../../docs/server/configuration/) directly in `/usr/local/etc/deepstream` or create a copy and run deepstream with the `-c` flag. (Important, make sure to update all relative paths within the configuration after copying it).

```bash
$ cd ~
$ cp /usr/local/etc/deepstream .
$ ls
config.yml  permissions.yml  users.yml
$ deepstream start -c config.yml
```

### Downloading deepstream's source code
You can also get the package and sources directly from [deepstream's release page](https://github.com/deepstreamIO/deepstream.io/releases)
