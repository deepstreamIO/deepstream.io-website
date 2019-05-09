---
title: HTTP Servers
description: Learn how to use a webserver together with deepstream
---

deepstream is a realtime data server and a great one of that. It is not an HTTP or general purpose webserver though. That means that if you're building a webapplication that needs to serve HTML or CSS files, images etc., you'll also need a classic HTTP server. For that, you have a number of choices

## Using Nginx, Apache, Tomcat, IIS etc.
You can use any established webserver together with deepstream. Just make sure that the URL path to route HTTP/WS traffic (by default `yourdomain.com/deepstream`) is proxied forward.

You can change this path by setting `urlPath` in the server config and `path` in the client options to a different value.

Here's an example of what the proxy configuration would look like for Nginx. To learn more about how to use Nginx as a reverse proxy and load balancer for deepstream, head over to the [Nginx Tutorial](../other-nginx/)

```bash
# in the http{} configuration block
upstream deepstream {
    ip_hash;
    server localhost:6020;
    # add more servers here for loadbalancing
}

server {
    server_name app.domain.com;
    listen 80;
    location /deepstream {
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_http_version 1.1;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header Host $host;
        proxy_pass http://deepstream;
    }
}
```

## Using a CDN / static file hosting service
Especially for larger deployments it can make perfect sense to keep your server logic in deepstream and serve assets via a static file host, fronted by a Content Delivery Network (CDN). Similar to the section above, all that's necessary here is to exclude the `/deepstream` path from the CDN. Depending on your CDN of choice, this can be a bit tricky though. [AWS Cloudfront](https://aws.amazon.com/cloudfront/) for instance only allows proxying of HTTP traffic, so deepstream traffic needs to be re-routed on an [Elastic Load Balancer](https://aws.amazon.com/elasticloadbalancing/) level, [more about this here](https://forums.aws.amazon.com/thread.jspa?messageID=589328). Other CDNs like [CloudFlare](https://www.cloudflare.com/) support socket traffic directly, [more about this here](https://blog.cloudflare.com/cloudflare-now-supports-websockets/).

## Using deepstream in Node with ExpressJS, Koa or Hapi
If you're using deepstream in Node.js, it can share a HTTP server with frameworks such as [Express](//expressjs.com/), [Koa](//koajs.com/) or [Hapi](//hapijs.com/).

For ExpressJS for instance, you'd create your server as follows

```javascript
var Deepstream = require( 'deepstream.io' );
var http = require( 'http' );
var express = require( 'express' );

// Create an express app
var app = express();

// Explicitly create a http server and
// register the express app as an request listener
var server = http.createServer( app );

// Write your express code as usual
app.get( '/hello', function ( req, res ) {
  res.send( 'Hello to you too!' );
});

// Create your deepstream server
var deepstream = new Deepstream();
// Pass it the existing HTTP server
deepstream.set( 'httpServer', server );
// Start deepstream
deepstream.start();

// Start the http server explicitly,
// rather than calling app.listen()
server.listen( 6020, function(){
    console.log( 'HTTP server listening on 6020' );
});
```

Here's an example to see this in action

<a class="mega" href="//github.com/deepstreamIO/ds-tutorial-express"><i class="fa fa-github"></i>deepstream & express example on Github</a>
