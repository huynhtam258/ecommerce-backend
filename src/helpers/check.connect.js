const mongoose = require('mongoose');
const os = require('os');
const process = require('process')

const _SECCOND = 5000
// count connect
const countConnect = () => {
  const numConnection = mongoose.connections.length
  console.log(`Number of connections:: ${numConnection}`);
}

// check over load
const checkOverload = () => {
  setInterval(() => {
    const numberConnection = mongoose.connections.length;
    const numCores = os.cpus().length;
    const memoryUsage = process.memoryUsage().rss;

    //Example maximum number of connections based on number osf cores
    const maxConnection = numCores * 5;
    console.log(`Active connections:${numberConnection}`);
    console.log(`Memory usage::${memoryUsage / 1024 / 1024}MB`);

    if (numberConnection > maxConnection) {
      console.log(`Connection overload detected!`);
    }
  }, _SECCOND); // Monitor every 5 secconds
}

module.exports = {
  countConnect,
  checkOverload
}