#### What is Redis?
A lot of things. In fact, so many that its often referred to as the "Swiss Army Knife of the web". Redis is first and foremost a cache. It's fast, simple, single threaded with non-blocking I/O and scales well in distributed deployments (should sound familiar to deepstream fans).

But it also persists its data to disk, making it a good alternative to full-size databases for simpler usecases and can act as a publish/subscribe server for message distribution.

![Redis](redis.png)

You can easily install Redis yourself or use it as a service from your cloud hosting provider, e.g. via [AWS ElastiCache](https://aws.amazon.com/elasticache/), [Microsoft Azure](https://azure.microsoft.com/en-us/services/cache/) or [RackSpace's Object Rocket](http://objectrocket.com/). Due to its popularity there are also a number of specialized Redis hosting companies, e.g. [RedisLabs](https://redislabs.com/), [RedisGreen](http://www.redisgreen.net/), [Compose](https://www.compose.io/) or [ScaleGrid](https://scalegrid.io/), but be careful: deepstream constantly interacts with its cache, so every millisecond network latency between its server and your RedisHoster makes deepstream notably slower. We strongly recommend choosing a cache that runs in close network proximity to your deepstream servers, e.g. within the same data-center.

#### Why use Redis with deepstream?
Redis is a great fit for use with deepstream. It can be used as a cache, persists data and re-distributes messages for smaller to medium sized deepstream clusters. It won't be much help when it comes to executing complex queries, but if you can live without, Redis might be all you need for your production deployment.