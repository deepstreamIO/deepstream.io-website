---
title: Performance Overview
description: An overview on deepstream performance and running your tests
---

Realtime web applications have a wide range of performance requirements. Apps with a focus on collaboration need to be able to sync changes between large numbers of clients, financial platforms must fan out prices with ultra-low latency and apps with a focus on communication require comparable up- and down-stream times.

To ensure deepstream can cater for all these use cases, we are regularly conducting performance tests and benchmarks.

In doing so, we have three main goals. We want to:

* quantify deepstream’s performance to help choose the right hardware and deployment strategy
* develop a suite of benchmarks that create reproducible results to help detect any decline in performance early on
* make it easier to compare deepstream against other realtime servers to help you choose the right tool for your performance requirements

Please note: The following tests are non-conclusive and will be improved and extended as development progresses. If you have a particular performance test scenario in mind or noticed a bottleneck within deepstream, please write to us at [info@deepstream.io](mailto:info@deepstream.io).


## Performance tests reduces risk by:

* understanding how the system reacts under an expected load
* ensuring the system can sustain the expected load for long periods of time
* understanding how the system will react when reaching its full capacity
* understanding how the system will react  when put under extreme load for a short period of time

## What type of tests can take these into account?

* load tests<br />
    Make sure that the system works as expected under a set conditions. This covers *CPU* and *message latency* and its output can be used to determine what kind of deployment structure would suit you best.
* soak tests<br />
    Run tests for a long period of time with slightly higher traffic. This covers *memory* and *message latency* and is used to ensure the system can run in production for long periods of time without reducing performance or crashing.
* stress tests<br />
    Push the system into critical usage of CPU and/or network usage and/or Memory and determine how it reacts.
* spike tests<br />
    Generating large amounts of clients or traffic in a very small amount of time and ensuring that the system does not fail.

## How can you improve results?

deepstream is designed as a distributed system. Individual nodes can multiplex updates amongst each other. This means that it’s possible to keep message latency and throughput rates steady whilst catering for an ever increasing number of simultaneously connected clients – simply by spinning up additional deepstream nodes as needed.

To put this statement into numbers, please see the performance test results for [a single node in comparison to a three instance cluster](../single-node-vs-cluster/).

## How to run the tests yourself

When running these tests, we're using a [performance test harness that's available on github](//github.com/deepstreamIO/deepstream.io-performance). It makes it easy to quickly spin up large numbers of deepstream servers and clients.

Clients are created in pairs that send messages back and forth on a unique record in order to calculate latency and keep track of updates.
Each client increments the same field of a record in turns ( even and odd ) until the configured number of messages for the test case is reached.

Using a combination of the following environment variables you can adjust the test harness to either run high throughput, high concurrency or long duration tests.


| Enviroment Variable       |  Example Value | Description                                                        |
| ------------------------- | -------------- | ------------------------------------------------------------------ |
| DEEPSTREAMS               | 6021,7021      | The deepstream ports to create or connect to           |
| HOST                      | localhost      | The deepstream host to connect to                                  |
| SERVER_SPAWNING_SPEED     | 1000           | The interval at which servers are spawned ( in ms )                |
| TEST_TIME                 | 100000         | The time for server to run ( in ms )                               |
| LOG_LEVEL                 | 3              | The server log level                                               |
| CLIENT_PAIRS              | 125            | Amount of client pairs to create                                   |
| MESSAGE_FREQUENCY         | 25             | How often to send messages ( in ms )                               |
| MESSAGE_LIMIT             | 5000           | Limit of messages per pair                                         |
| CLIENT_SPAWNING_SPEED     | 100            | Speed of generating clients ( in ms )                              |
| LOG_LATENCY               | true           | Print client latency ( requires CALCULATE_LATENCY to be true )     |
| CALCULATE_LATENCY         | true           | Store client latency during test                                   |
