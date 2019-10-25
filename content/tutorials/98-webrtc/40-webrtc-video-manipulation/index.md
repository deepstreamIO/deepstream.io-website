---
title: "WebRTC 04: Video Editing / Canvas Streams"
description: Applying filters to a WebRTC video stream before transmitting it
tags: [WebRTC, Canvas, getUserMedia, captureStream, filter, video manipulation]
---

In the [previous tutorial](../webrtc-audio-video) we've discussed how to share unaltered audio and video streams between browsers - but in times of Snapchat, dog snout overlays and vintage effect filters this might not be enough. So in this tutorial we'll look into manipulating the video before sending.

## How it works

[Steps](steps.png)

Manipulating videos takes a few steps:
1. Capturing a webcam stream using `navigator.getUserMedia()`
2. Playing the stream on an HTML5 video element
3. Painting each frame of this video onto an HTML5 Canvas Element
4. Reading the pixels from the first canvas on every frame, manipulating them and drawing them onto a second canvas element
5. Using the second canvas' `.captureStream()` method to create a video stream and transmit it via our peer connection
6. Receiving the manipulated stream on the other peer and playing it on a video tag

Let's go trough these steps one by one. You can find the complete [code on GitHub](https://github.com/deepstreamIO/dsh-demo-webrtc-examples/blob/master/04-canvas-streams/canvas-streams.js) or in the editable example below.

## 1. / 2. Capturing a webcam stream
Capturing a webcam stream is done using `navigator.getUserMedia()` with a constraints object specifying what we need (only video in this case) and callbacks for success and error.

```javascript
navigator.getUserMedia({ video: true },
    stream => {
        localStream = stream;
        $( '.local video' ).attr( 'src', URL.createObjectURL( stream ) );
        drawToCanvas();
    },
    error => {
        alert( 'error while accessing usermedia ' + error.toString() );
    }
);
```

Once the stream becomes available, we'll play it on a video tag using `URL.createObjectURL( stream )` as well as drawing it onto the first canvas element.

## 3. Painting a video to a canvas
A [canvas](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial) is an HTML5 element that can be used to draw pixel data. Our video is just that - a source of pixel data that changes on every drawn frame.

To draw it onto a canvas we start by creating a canvas element with the same size as the video...

```html
<video autoplay width="300" height="225"></video>
<canvas width="300" height="225"></canvas>
```

...and acquire a 2d-drawing context from it.

```javascript
var localVideo = $( '.local video' )[ 0 ];
var inputCtx = $( '.input-canvas canvas' )[ 0 ].getContext( '2d' );
```

Now in our `drawToCanvas()` method we paint every frame of the video onto the canvas using `.drawImage()`:

```javascript
function drawToCanvas() {
    // draw the current frame of localVideo onto the canvas,
    // starting at 0, 0 (top-left corner) and covering its full
    // width and heigth
    inputCtx.drawImage( localVideo, 0, 0, 300, 225 );

    //repeat this every time a new frame becomes available using
    //the browser's build-in requestAnimationFrame method
    requestAnimationFrame( drawToCanvas );
}
```


## 4. Manipulating the videostream
At this point you should see two identical video-clips - one on a video tag, one on a canvas element. Now that our video is on a canvas, we can access its raw pixel-data using `ctx.getImageData()`, manipulate it and draw it onto the second canvas. We'll do this in `drawToCanvas()` on every frame to apply a simple greyscale filter:

```javascript
    // get the pixel data from input canvas
    var pixelData = inputCtx.getImageData( 0, 0, 300, 255 );

    var avg, i;

    // apply a  simple greyscale transformation
    for( i = 0; i < pixelData.data.length; i += 4 ) {
        avg = (
            pixelData.data[ i ] +
            pixelData.data[ i + 1 ] +
            pixelData.data[ i + 2 ]
        ) / 3;
        pixelData.data[ i ] = avg;
        pixelData.data[ i + 1 ] = avg;
        pixelData.data[ i + 2 ] = avg;
    }

    // write the manipulated pixel data to the second canvas
    outputCtx.putImageData( pixelData, 0, 0 );
```

## 5. Turn the manipulated video data into a stream
The only thing left at this point is to establish a [simple peer connection](/tutorials/webrtc//webrtc-datachannels/) and provide a video stream from our output canvas using its `.captureStream()` method.

```javascript
const p2pConnection = new SimplePeer({
    initiator: document.location.hash === '#initiator',
    stream: $( '.output-canvas canvas' )[ 0 ].captureStream()
});
```

## 6. Receiving the video on the other client
All the other client has to do now is to subscribe to its connection's regular `'stream'` event and display the stream on a video tag:

```javascript
p2pConnection.on( 'stream', remoteStream => {
    $( '.remote video' )
        .attr( 'src', URL.createObjectURL( remoteStream ) );
});
```

To summarize: mediastreams can not only be created from videos, but from a number of different resources such as audio elements, canvas or - as we'll see in [the next tutorial](../webrtc-screen-sharing) - the entire browser window.
