---
title: Open Source Contribution Guidelines
description: Find out how you can contribute to deepstream
---

We love getting feedback and contributions from the opensource community. Please try to adhere to this guide when reporting any issues or making any changes.

### PRs and Code Contributions

* Tests must pass and not reduce coverage
* Any changes, bug fixes or new features must include relevant tests
* Pull requests should be made to the master branch.
* Before we can accept your pull requests, you need to sign our [Contributor License Agreement](../cla/)

## Ways to contribute

### Logging Issues

All issues should include the deepstream.io and client language and version.

For issues related to the deepstream.io server, please include the results of running:

```bash
deepstream info
```

Which will print out something similar to this:

// TODO: V4 Update
```json
{
  "deepstreamVersion": "1.0.0-rc.3",
  "gitRef": "d638e19f6e081601add6b98270f64acde80243ca",
  "buildTime": "Mon Jul 04 2016 11:12:31 GMT+0200 (CEST)",
  "platform": "darwin",
  "arch": "x64",
  "nodeVersion": "v4.4.5",
  "libs": [
    "deepstream.io-logger-winston:1.1.0",
    "uws:0.6.5"
  ]
}
```

#### Website
We're always looking to improve documentation, weed out those typos that sneak past us and add tutorials on the plethora of things we can integrate. If you feel anything needs to be clarified, would like to write/see a guide on how to use it with your favourite framework or anything else just raise an issue [here](//github.com/deepstreamIO/deepstream.io-website)

#### Clients
deepstream uses a [minimal text based protocol](../../protocol/message-structure-overview/), and as such can work with any language on an internet enabled device. Want to support your language of choice? Join the conversations [on github](//github.com/deepstreamIO/deepstream.io/issues?q=is%3Aopen+is%3Aissue+label%3Anew-client) or [write your own](/tutorials/core/writing-a-client/). There are quite a few being built by the community and I'm sure they would love more collaborators!

Feel free to [contact us](../get-in-touch/) if you have any questions.
