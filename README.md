# CoffeeKiq

Coffeescript/Node.js Library to enqueue Jobs to Sidekiq.

This is a very trivial implementation. I will implement more features when I need them.
Feel free to contribute.


## USAGE

First, you'll want to queue some jobs in your app:

```coffeescript
# Creates an instance of CoffeeKiq
CoffeeKiq = require('coffeekiq').CoffeeKiq
coffeekiq = new CoffeeKiq "redis_port", "redis_host"

# Enqueues a Job to redis
coffeekiq.perform 'queue', 'WorkerClass', ['arg1', 'arg2']
```
