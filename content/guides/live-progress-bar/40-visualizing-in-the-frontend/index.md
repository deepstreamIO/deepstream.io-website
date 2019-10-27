---
title: Visualizing in the frontend
description: "Step three: Visualizing in the frontend"
---

All that's left is for us to subscribe to the event and update the progress bar state whenever an event comes through.

In the skeleton app we have a function called `updateProgressBar` which takes a the percentage and associated message and sets it on the progress bar.

All we need to do to hook up events is subscribe to the unique event when making the request

```javascript
try {
    // subscribe to changes
    client.event.subscribe(`progress:${id}`, updateProgressBar)
    // make the actual post request
    const data = await postData('http://localhost:9090/post', { id })
} catch (e) {
    // error happened getting data
} finally {
    // unsubscribe to changes, whether it failed or succeeded
    client.event.unsubscribe(`progress:${id}`, updateProgressBar)
}
```

And that's it, you should now have progress events working!