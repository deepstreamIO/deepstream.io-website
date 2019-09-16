---
title: Nginx
description: Using Nginx as a reverse proxy and load balancer for Websocket traffic
logoImage: nginx.png
redirectFrom: [/tutorials/integrations/other-servers/http/, /tutorials/integrations/other-servers/nginx/]
---

## What is nginx?
[Nginx](https://nginx.org/) (pronounced engine-x) is a multi purpose webserver. It's one of the most widely used HTTP servers and powers sites such as GitHub or reddit. Aside from serving static files via HTTP, it can be used as a reverse proxy, multi protocol load balancer or container for fast CGI scripts

## Using nginx and deepstream
Nginx can be used as a web-facing reverse proxy and load balancer in front of deepstream servers.

![A simple deployment with nginx and deepstream](deepstream-nginx-deployment-diagram.png)

#### Reverse Proxy
For HTTP deployments it is common practice to not directly expose the webserver to the internet, but instead place a different server in front of it. For deepstream.io production deployments we highly recommend doing the same.
This "reverse proxy" handles tasks like SSL termination (decrypting incoming messages via WSS ) and high availability / error reporting (e.g. replying to requests with a 500 status if the underlying server is unavailable).

#### Load Balancer
deepstream can scale horizontally via clustering. If you want to provide a single URL for clients to connect to your cluster, you need to place something in front that distributes incoming connections between the available servers: a load balancer.
Load balancing persistent connections can be a bit tricky sometimes. deepstream supports connections made via WebSockets.

## Alternatives to nginx
Instead of nginx you could also use e.g. [HA Proxy](http://www.haproxy.org/) or [Apache](https://httpd.apache.org/)

#### What about AWS Elastic Load Balancer?
If you're deploying deepstream on AWS, you'd probably want to use Amazon's well integrated load balancing service ALB. It allows you to combine ssl termination, load balancing and health-checks for easy deployment.

## Installing nginx for use with deepstream
By default, Nginx comes with everything you need to use it as an HTTP server. To use it as a stream server though, you need to build it with its stream module enabled (`--with-stream`). On CentOS/AWS Linux this works as follows, for other Linux distributions, have a [look here](https://www.nginx.com/resources/admin-guide/installing-nginx-open-source/).

```bash
# install gcc (needed to compile nginx)
yum update
yum install -y aws-cli openssl-devel

# download and unzip nginx stable version (check for latest version number before using)
wget http://nginx.org/download/nginx-1.11.5.tar.gz
tar zxf nginx-1.11.5.tar.gz
mv nginx-1.11.5 nginx
cd nginx

# enable stream, disable unneeded http modules that require additional dependencies
./configure --with-stream --with-stream_ssl_module --without-http_rewrite_module --without-http_gzip_module

# build and install
make install
```

## Configuring nginx as a stream proxy / load balancer
The following configuration shows how to use nginx as a load balancer, SSL termination point and reverse proxy for HTTP, WS and TCP connections. If you only want to use parts of this functionality, remove the unneeded bits.

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {   
    map $http_upgrade $connection_upgrade {
        default upgrade;
        '' close;
    }

    upstream websocket {
      server localhost:6020; #Websockets
    }

    upstream httpendpoint {
      server localhost:8080; #HTTP
    }

    server {
       listen 9090 ssl;
       server_name localhost;

       ssl_protocols       TLSv1 TLSv1.1 TLSv1.2;
       ssl_ciphers         HIGH:!aNULL:!MD5;

       ssl_certificate /etc/ssl/certs/cert.crt;
       ssl_certificate_key  /etc/ssl/certs/key.key;

       # Deepstream websocket redirect
       location /deepstream {
            proxy_pass http://websocket;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection "Upgrade";
       }

        # Deepstream http endpoint
        location /http {
            proxy_pass http://httpendpoint;
            proxy_http_version 1.1;
            rewrite ^/http(.*) /$1 break;
        }
   }
}
```
