const amqp = require('amqplib');
const message = 'new a product: Title JS'

const log = console.log
console.log = function() {
    log.apply(console, [new Date()].concat(arguments))
}

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')
        const channel = await connection.createChannel()
        const notificationExchange = 'notificationEx' // notificationEx direct
        const notiQueue = 'notificationQueueProcess' // assertQueue
        const notificationExchangeDLX = 'notificationExDLX' // notificationEx direct
        const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX' //assert

        // 1. create exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true // khi server chết message vẫn còn trong hàng đợi
        })

        // 2. create queue
        // khi một tin nhắn hết hạn thì nó sẽ gửi đến hàng đợi notificationExchangeDLX bằng key notificationRoutingKeyDLX
        const queueResult = await channel.assertQueue( notiQueue, {
            exclusive: false, // cho phép các kết nối truy cập vào cùng 1 hàng đợi
            deadLetterExchange: notificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })
        // 3. bindQueue 
        // liên kết giữa queue name và change notification exchange
        await channel.bindQueue(queueResult.queue, notificationExchange)

        // 4. send message
        const msg = 'a new product'
        console.log('producer msg::', msg)
        
        // expiration: thời gian gửi tin nhắn
        await channel.sendToQueue(queueResult.queue, Buffer.from(msg), {
            expiration: '10000'
        })



        setTimeout(() => {
            connection.close();
            process.exit(0)
        }, 500);
    } catch (error) {
        console.error(error)
    }
}

runProducer().catch(error => console.error(error))