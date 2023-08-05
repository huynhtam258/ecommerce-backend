const redis = require('redis');
const { promisify } = require('util');

const setNXAsync = function(key, value) {
  return redisClient.setNX(key, value);
};

const acquireLock = async (productId, quantity, cartId) => {
  const key = `lock_v2023_${productId}`;
  const retryTimes = 10;
  const expireTime = 3000; // 3 giay tam lock

  for (let i = 0; i < retryTimes; i++) {
    // tao 1 key, thang nao nam giu duoc vao thanh toan
    const result = await promisify(setNXAsync)(key, expireTime);
    console.log(`result:::`, result);
    if (result === 1) {
      //thao tac voi inventory
      const isReversation = await reservationInventory({
        productId, quantity, cartId
      });
      if (isReversation.modifiedCount) {
        await pexpire(key, expireTime)
        return key
      }
      return null
    } else {
      await new Promise((resolve) => setTimeout(resolve, 50))
    }
  }
};

const releaseLock = async keyLock => {
  const delAsyncKey = promisify(redisClient.del).bind(redisClient)
  return await delAsyncKey(keyLock)
}

module.exports = {
  acquireLock,
  releaseLock
}