---
title: Installing on CentOS
description: Learn how to install deepstream on CentOS
---

deepstream is available via the YUM package manager. Just add the repository to your repositories file, and install deepstream using the following script.

```bash
sudo wget https://bintray.com/deepstreamio/rpm/rpm -O /etc/yum.repos.d/bintray-deepstreamio-rpm.repo
sudo yum install -y deepstream.io
```

## Starting deepstream
After installing, use the deepstream command to start the server via its [command line interface](/docs/server/command-line-interface/).
```bash
deepstream start
```

![Starting deepstream on linux](../linux-start.png)

### Configuring deepstream
You can either change deepstream's [configuration file](/docs/server/configuration/) directly in `/etc/deepstream` or create a copy and run deepstream with the `-c` flag. (Important, make sure to update all relative paths within the configuration after copying it).

```bash
$ cd ~
$ cp /etc/deepstream/* .
$ ls
config.yml  permissions.yml  users.yml
$ deepstream start -c config.yml
```
