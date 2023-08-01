const redis = require('redis');
// const { redis: { host, port, username, password}}

class RedisConfig {
  constructor() {
    this.connect()
  }

  connect() {
    const client = redis.createClient({
      port: 6379,
      host: 'localhost'
    })
    client.on('connect', () => {
      console.log(`Connected: Redis connected`)
    })

    client.on('error', () => {
      console.log(`Error: Redis connected`)
    })
  }
  
  static getInstance () {
    if (!RedisConfig.instance) {
      RedisConfig.instance = new RedisConfig()
    }

    return RedisConfig.instance
  }
}

const instanceRedis = RedisConfig.getInstance()
module.exports = instanceRedis;