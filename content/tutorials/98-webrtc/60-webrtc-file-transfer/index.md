---
title: "WebRTC 06: File Transfer"
description: Learn how to read, transfer, receive and download a file between two browsers
tags: [WebRTC, FileReader, Blob, Download Blob, JavaScript]
---

WebRTC makes it possible to transfer any file between two browsers using [data-channels](https://deepstreamhub.com/tutorials/protocols/webrtc-datachannels/) and binary data.

## How does binary data work in browsers
The current generation of browsers allow you to send arrays of bytes - groups of eight zeros or ones that can specify numbers between 0 and 255. To work with these, they provide a number of concepts - `Uint8Array`s  to store them in, `FileReader`s to create them and `Blob`s to assemble them. Transports like Websockets and WebRTC allow for the transmission of raw byte streams.

## Why is that important
Transferring files between two browsers means working directly with binary data. There is no `sendFile()` or `onFileReceived` API - instead its up to the developer to get the file from a [file input](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input), via [drag and drop](https://www.html5rocks.com/en/tutorials/casestudies/box_dnd_download/) or - if you're building a chrome app with elevated permissions - from the [file system API](https://developer.chrome.com/apps/fileSystem), read it using a [FileReader](https://developer.mozilla.org/en/docs/Web/API/FileReader), transmit it in chunks, reassemble it on the other side and finally trick the browser into downloading it.

## Establishing a manipulated P2P Connection
For this tutorial we assume you already know how to establish a connection between two peers as described in [the first tutorial](https://deepstreamhub.com/tutorials/protocols/webrtc-datachannels/). There is one extra bit we have to do though: By default Chrome caps the transfer rate for WebRTC datachannels to 30 kbps - at this speed downloading GTA 5 on Steam would take a solid 25 days nonstop.

Fortunately, the offer [sdp](https://andrewjprokop.wordpress.com/2013/09/30/understanding-session-description-protocol-sdp/) is just a string - which means we can fiddle with it before sending. This can be done by adding this line to our outgoing signal callback:

```javascript
signal.sdp = signal.sdp.replace( 'b=AS:30', 'b=AS:1638400' );
```

## Getting a file
We'll use a simple file input that lets users pick one file a time:

```html
<input id="my-file" type="file" />
```

As soon as the user selects a file, it will be available as an entry in the input's [FileList](https://developer.mozilla.org/en/docs/Web/API/FileList) and can be retrieved via

```javascript
var file = fileInput.files[ 0 ];
```

Each [file object](https://developer.mozilla.org/en-US/docs/Web/API/File) has a `name` , `size` and `type` property and allows us to access its data via `.slice(start, end)` which returns a `Blob`.

## Reading and sending a file
We can't do much with Blobs - what we need is an ArrayBuffer. We can get one by using a [FileReader](https://developer.mozilla.org/en/docs/Web/API/FileReader) - a helpful utility that allows us to read our file in multiple chunks and start sending data whilst still reading it.

We need to be careful about the size of our chunks - there's a [certain mystery](http://viblast.com/blog/2015/2/5/webrtc-data-channel-message-size/) about the exact possible maximum, but 1200 bytes per chunk seems to be a solid upper limit.

Combining all these requirements gives us the following code for reading and sending files:

```javascript
const BYTES_PER_CHUNK = 1200;
var file;
var currentChunk;
var fileInput = $( 'input[type=file]' );
var fileReader = new FileReader();

function readNextChunk() {
    var start = BYTES_PER_CHUNK * currentChunk;
    var end = Math.min( file.size, start + BYTES_PER_CHUNK );
    fileReader.readAsArrayBuffer( file.slice( start, end ) );
}

fileReader.onload = function() {
    p2pConnection.send( fileReader.result );
    currentChunk++;

    if( BYTES_PER_CHUNK * currentChunk < file.size ) {
        readNextChunk();
    }
};

fileInput.on( 'change', function() {
    file = fileInput[ 0 ].files[ 0 ];
    currentChunk = 0;
    // send some metadata about our file
    // to the receiver
    p2pConnection.send(JSON.stringify({
        fileName: file.name,
        fileSize: file.size
    }));
    readNextChunk();
});
```

## Receiving and reassembling a file
As a receiver our connection now spits out a combination of somewhat unrelated text and binary messages. It's our responsibility to reassemble them into a file again.

To do this we first need to know about the name and more importantly `size` of the file we are receiving. These are transferred as text in

```javascript
p2pConnection.send(JSON.stringify({
    fileName: file.name,
    fileSize: file.size
}));
```

and received in our P2pConnection's `data` event. Our receiver is built on the assumption that each file transfer starts with a single text message followed by individual chunks in order until the full amount of bytes is received. This is the simplest scenario, but not the fastest. To speed-up transfers you may want to consider using [unordered but reliable](https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createDataChannel#RTCDataChannelInit_dictionary) transfers and reserving the first few bytes of every chunk to keep track of the packet order.

Put together this would look as follows:
```javascript
var incomingFileInfo;
var incomingFileData;
var bytesReceived;
var downloadInProgress = false;

p2pConnection.on( 'data', data => {
    if( downloadInProgress === false ) {
        startDownload( data );
    } else {
        progressDownload( data );
    }
});

function startDownload( data ) {
    incomingFileInfo = JSON.parse( data.toString() );
    incomingFileData = [];
    bytesReceived = 0;
    downloadInProgress = true;
    console.log( 'incoming file <b>' + incomingFileInfo.fileName + '</b> of ' + incomingFileInfo.fileSize + ' bytes' );
}

function progressDownload( data ) {
    bytesReceived += data.byteLength;
    incomingFileData.push( data );
    console.log( 'progress: ' +  ((bytesReceived / incomingFileInfo.fileSize ) * 100).toFixed( 2 ) + '%' );
    if( bytesReceived === incomingFileInfo.fileSize ) {
        endDownload();
    }
}
```


## downloading a file
All that's missing now is `endDownload` - a function that concatenates our received bytes and initiates a download. Assembling our file is achieved by simply casting our multiple byte-arrays in `incomingFileData` into a single Blob

```javascript
blob = new Blob( incomingFileData );
```

The second part is a bit trickier - currently our entire file only exists in the browser's memory. To trigger a download we generate a link. set its source to our Blob via

```javascript
    anchor.href = URL.createObjectURL( blob );
```

tell it what filename to use via

```javascript
    anchor.download = incomingFileInfo.fileName;
```

and finally invoke a (cross browserish) click

```javascript
function endDownload() {
    downloadInProgress = false;
    var blob = new window.Blob( incomingFileData );
    var anchor = document.createElement( 'a' );
    anchor.href = URL.createObjectURL( blob );
    anchor.download = incomingFileInfo.fileName;
    anchor.textContent = 'XXXXXXX';

    if( anchor.click ) {
        anchor.click();
    } else {
        var evt = document.createEvent( 'MouseEvents' );
        evt.initMouseEvent( 'click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null );
        anchor.dispatchEvent( evt );
    }
}
```

Phew - that was hard. But hey, it's the last tutorial in this series. All that's left now is to wrap up with [an overview of what it takes to use WebRTC in production apps](https://deepstreamhub.com/tutorials/protocols/webrtc-in-production/)
