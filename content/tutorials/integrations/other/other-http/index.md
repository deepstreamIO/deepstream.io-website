---
title: HTTP Servers
description: Learn how to use a webserver together with deepstream
draft: false
---

deepstream is a realtime data server and a great one of that. It is not a general purpose webserver though. That means that if you're building a web application that needs to serve HTML or CSS files, images etc., you'll also need a classic HTTP server. For that, you have a number of choices

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

## Run via your own node server

Deepstream doesn't expose the built in HTTP server to users, but you can opt to provide your own simple by doing the following:

`embed: js/server-customhttp.js`