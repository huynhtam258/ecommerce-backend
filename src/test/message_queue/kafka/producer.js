const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:29092']
})

const producer = kafka.producer();

const runProducer = async () => {
  await producer.connect()
  await producer.send({
    topic: 'test-topic',
    messages: [
      { value: 'Hello KafkaJs user By JS' }
    ]
  })

  await producer.disconnect()
}

runProducer().catch(console.error)