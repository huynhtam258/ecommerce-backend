const amqp = require('amqplib');
const messages = "Hello, rabbitMQ for JS"

const runProducer = async () => {
  try {
    // username - password
    const connection = await amqp.connect('amqp://guest:guest@localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(messages));
    console.log(`messsage sent:`, messages);
  } catch (error) {
    console.error(error)
  }
}

runProducer().catch(console.error)