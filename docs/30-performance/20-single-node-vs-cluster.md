---
title: Latency tests
description: A suite of tests to determine message latency under load
---

### Test Setup
All tests were run on Amazon Web Services EC2 instances within the same region, running AWS Linux. For the cluster tests, Redis was used as a message bus.

||Single Node|Cluster||
|---|---|---|---|
|machine for deepstream servers|1 EC2 c4.large|1 EC2 c4.2xlarge|
|deepstream servers|1|3|
|client pairs|250|750|
|ec2 t2.micro instances clients were distributed across|2|6|
|message frequency per client|~25ms|~25ms|
|duration of full load|~3 min|~12 min|
|messages per second|~10,000|~30,000|

## Single deepstream Node

#### Latency Distribution
Average latency was 2.065ms ( machines being within same data centre )

![Single deepstream latency](one-ds-latency.png)

Average latency was 0.999ms ( machines being within same data centre )

![deepstream cluster latency](three-ds-latency.png)
