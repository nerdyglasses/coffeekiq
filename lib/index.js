// Generated by CoffeeScript 1.4.0
(function() {
  var CoffeeKiq, EventEmitter, crypto, redis, util, _,
    __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  EventEmitter = require("events").EventEmitter;

  util = require('util');

  crypto = require('crypto');

  redis = require('redis');

  _ = require('underscore');

  CoffeeKiq = (function(_super) {

    __extends(CoffeeKiq, _super);

    function CoffeeKiq(redis_port, redis_host, redis_password) {
      if (redis_password == null) {
        redis_password = null;
      }
      this.on_redis_error = __bind(this.on_redis_error, this);

      this.on_redis_ready = __bind(this.on_redis_ready, this);

      if (!(redis_port != null) || !(redis_host != null)) {
        throw new Error('CoffeeKiq: Init like this: new CoffeeKiq(redis_port, redis_host)');
      }
      this.redis_port = redis_port;
      this.redis_host = redis_host;
      this.redis_password = redis_password;
      this.connected = false;
      this.connect();
    }

    CoffeeKiq.prototype.connect = function() {
      this.redis_client = redis.createClient(this.redis_port, this.redis_host);
      if (this.redis_password !== null) {
        this.redis_client.auth(this.redis_password);
      }
      this.redis_client.on('ready', this.on_redis_ready);
      return this.redis_client.on('error', this.on_redis_error);
    };

    CoffeeKiq.prototype.perform = function(queue, klass, args, options) {
      var namespace, retry,
        _this = this;
      if (options == null) {
        options = {};
      }
      if (this.connected) {
        if (!(options.namespace != null)) {
          namespace = "";
        } else {
          namespace = options.namespace;
        }
        if (!(options.retry != null)) {
          retry = false;
        } else {
          retry = true;
        }
        return crypto.randomBytes(12, function(ex, buf) {
          var payload;
          payload = JSON.stringify({
            queue: queue,
            "class": klass,
            args: args,
            jid: buf.toString('hex')
          });
          _this.redis_client.sadd(_.compact([namespace, "queues"]).join(":"), queue);
          _this.redis_client.lpush(_.compact([namespace, "queue", queue]).join(":"), payload);
          _this.emit('perform:done');
          return true;
        });
      } else {
        this.emit('perform:error');
        return false;
      }
    };

    CoffeeKiq.prototype.on_redis_ready = function() {
      this.connected = true;
      return this.emit('connection:ready');
    };

    CoffeeKiq.prototype.on_redis_error = function() {
      this.connected = false;
      return this.emit('connection:error');
    };

    CoffeeKiq.prototype.get_secure_random = function(callback) {
      return crypto.randomBytes(12, function(ex, buf) {
        return callback(buf.toString('hex'));
      });
    };

    return CoffeeKiq;

  })(EventEmitter);

  exports.CoffeeKiq = CoffeeKiq;

}).call(this);
