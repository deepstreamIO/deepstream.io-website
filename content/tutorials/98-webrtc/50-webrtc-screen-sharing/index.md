---
title: "WebRTC 05: Screen Sharing"
description: Create a video feed from your screen and share it via WebRTC
tags: [WebRTC, Canvas, getUserMedia, captureStream, Screensharing]
---

In this WebRTC tutorial for screensharing we won't be talking about WebRTC. Why? The video feed from your browser or desktop screen is just another MediaStream like the ones we've discussed in the [WebRTC Audio/Video tutorial](../webrtc-audio-video) and can be attached to a PeerConnection in the exact same way. The difference is: this MediaStream is a lot more complicated to optain.

## Getting a MediaStream from your screen
In a nutshell getting a MediaStream from your browser-window or desktop takes three steps:

Invoking the desktop capture dialog with

```javascript
chrome.desktopCapture.chooseDesktopMedia(
    ['screen', 'window'],
    port.sender.tab,
    onResponse
);
```

which launches a window like this:

![Screen Sharing Dialog](screen-sharing-dialog.png)

Once the user confirms, `onResponse` is invoked with a `sourceId` that needs to be passed to `navigator.getUserMedia()` as part of the video constraints definition

```javascript
navigator.getUserMedia({
    video:{
        mandatory: {
            chromeMediaSource: 'desktop',
            chromeMediaSourceId: sourceId
        }
    }},
    stream => {},
    error => {}
);
```

From here, all we have to do is attach our stream to either a WebRTC PeerConnection or play it on a video element...

### The hard part
But: this functionality is currently only available in Chrome and Firefox. Firefox allows it to be used directly, but Chrome makes the `chooseDesktopMedia` API only available to plugins (unless you're Google of course, Hangouts can use it directly)

This means the general workflow looks as follows:

1. The main page makes a [postMessage](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage) call to ask for a sourceId
2. The postMessage is received by a [Chrome extension content script](https://developer.chrome.com/extensions/content_scripts) which proxies it forward to an [event or background page](https://developer.chrome.com/extensions/event_pages).
3. This background page has access to the `chrome.*` APIs, invokes the screen sharing dialog, receives a sourceId and sends it back via postMessage
4. The content script once more forwards the response to the main page
5. The main page issues a `getUserMedia` query using the sourceId as part of the video constraints.

Here's how this works in code.

### 1. Making a postMessage call from the main page
and setting up a listener for the response looks as follows:
```javascript
    window.addEventListener( 'message', function( msg ){
        if( msg.data && msg.data.sourceId ) {
            getScreen( msg.data.sourceId );
        }
    }, false);

    window.postMessage( 'requestScreenSourceId', '*' );
```
Please note that it might be necessary to filter for certain types of response messages if your application uses postMessage for other purposes.

### 2. Proxying messages through the extension's contentscript
```javascript
// connect to chrome's runtime
var port = chrome.runtime.connect();

// forward messages from the page to the background script
window.addEventListener('message', function (event) {
    if (event.source === window) {
        port.postMessage( event.data );
    }
});

// forward messages from the background script to the page
port.onMessage.addListener(function (message) {
    window.postMessage(message, '*');
});
```

### 3. Requesting screen access from the background script
```javascript
chrome.runtime.onConnect.addListener(function (port) {
    function onResponse( sourceId ) {
        if(!sourceId || !sourceId.length) {
            port.postMessage('PermissionDeniedError');
        } else {
            port.postMessage({ sourceId: sourceId });
        }
    }

    function onMessage( msg ) {
        if( msg !== 'requestScreenSourceId' ) {
            return;
        }
        chrome.desktopCapture.chooseDesktopMedia(
            ['screen', 'window'], 
            port.sender.tab, 
            onResponse
        );
    }

    port.onMessage.addListener( onMessage );
});
```

### Packaging it as an extension
In order to turn both content and background script into a chrome extension we need to add a `manifest.json` file. You can find its full content [here](https://github.com/deepstreamIO/dsh-demo-webrtc-examples/blob/master/05-screen-sharing/chrome-addon/manifest.json), the important part is the permission to use the desktopCapture API:

```javascript
"permissions": [
    "desktopCapture"
]
```

as well as pointers to the content script

```javascript
"content_scripts": [ {
   "js": [ "content-script.js" ],
   "all_frames": true,
   "run_at": "document_end",
   // your domain here, only HTTPS works!
   "matches": ["https://deepstream.io/*"]
}]
```

and background script:

```javascript
"background": {
    "scripts": ["background-script.js"],
    "persistent": false
}
```

To try this example yourself you will first need to install the chrome extension. To do so

<a name="install-addon"></a>
- download or clone the [Github Repo](https://github.com/deepstreamIO/dsh-demo-webrtc-examples)
- Open chrome://extensions/
- Check `Developer Mode` at the top
- Click `Load unpacked extensions...`
- Select `05-screen-sharing/chrome-addon`

then click 'request desktop video'
