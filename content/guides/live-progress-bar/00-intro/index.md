---
title: Live Progress Bar
description: Learn how to create a Live Progress Bar using deepstream
tags: [realtime]
redirectFrom: [/guides/live-progress-bar/]
---

Users are impatient. Therefore, if you are going to keep them waiting, they deserve to know why and how long they will wait. It's not just in browsers; a lady in a waiting room would have some sense of feedback if she is given a tag and time slot, instead of leaving her there and just asking her to WAIT.

Spinners provide poor feedback for very long request-response activity. Indefinite progress bars are even worse. What you can do is provide a live progress bar that shows the current status. A situation where you:

- Receive a file
- Process the file
- Upload the file
- Save the file name to a database
- Respond with the file information saved

You will definitely need to let the user know what is happening behind the scenes so as to give them a good reason to wait. We will not do all that in our example, rather, we will simulate the time it takes to do each of them using `setTimeout`.

In each of the async functions, you can send realtime updates to the client informing her about what's ongoing on the server and why she is yet to receive a response.
