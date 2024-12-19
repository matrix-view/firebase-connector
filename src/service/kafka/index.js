const {Consumer, ConsumerGroupStream} = require("kafka-node");
const service = require("../../service");

const kafka = require('kafka-node'),
    Producer = kafka.Producer,
    client = new kafka.KafkaClient({
        kafkaHost: service.configuration['kafka-broker']
    }),
    producer = new Producer(client);

const payloads = [
    {
        topic: 'topic1',
        offset: 0, //default 0
        partition: 0 // default 0
    }
]

const options = {
    groupId: 'kafka-node-group',//consumer group id, default `kafka-node-group`
    // Auto commit config
    autoCommit: true,
    autoCommitIntervalMs: 5000,
    // The max wait time is the maximum amount of time in milliseconds to block waiting if insufficient data is available at the time the request is issued, default 100ms
    fetchMaxWaitMs: 100,
    // This is the minimum number of bytes of messages that must be available to give a response, default 1 byte
    fetchMinBytes: 1,
    // The maximum bytes to include in the message set for this partition. This helps bound the size of the response.
    fetchMaxBytes: 1024 * 1024,
    // If set true, consumer will fetch message from the given offset in the payloads
    fromOffset: false,
    // If set to 'buffer', values will be returned as raw buffer objects.
    encoding: 'utf8',
    keyEncoding: 'utf8'
}

const produceMessages = async (context) => {
    const {payloads} = context

    return new Promise((resolve, reject) => {
        producer.on('ready', function () {
            console.log("Producer ready")
            producer.send(payloads, function (err, data) {
                resolve(true)
            });

        });

        producer.on('error', function (err) {
            console.error('Error when connecting to broker', err)
            reject(err)
        })
    })

}


const consumeMessages = (context) => {
    const {configuration, callback} = context

    const kafka = require('kafka-node'),
        Consumer = kafka.Consumer,
        client = new kafka.KafkaClient({
            kafkaHost: configuration['kafka-broker'],
            connectTimeout: 10000,
            requestTimeout: 10000,
            autoConnect: true,
        }),
        consumer = new Consumer(
            client,
            payloads,
            options
        );
    client.on('ready', function () {
        console.log("ready")

        consumer.on('message', function (message) {
            console.log("message", message)
            if (callback) callback(message)
        })

        consumer.on('error', function (err) {
            console.error('Error when connecting to broker', err)
        })

    })


}


const createTopics = async (context) => {
    const {kafka, topics} = context
    const {producer} = kafka

    return new Promise((resolve, reject) => {

        producer.on('ready', function () {
            console.log("Producer ready")
            producer.createTopics(topics, false, function (err, data) {
                if (err) return reject(err)
                console.log('Topics created successfully', data)
                resolve(true)
            })
        })

        producer.on('error', function (err) {
            console.error('Error when connecting to broker', err)
            reject(err)
        })
    })
}

const testTopics = async (context) => {
    // Create topics
    context.topics = [{ topic: 'topic1', partition: 0 }, { topic: 'topic2', partition: 0 }]
    await service.kafkaService.createTopics(context)


    // Consumer

    context.callback = message => {
        console.log('success')
    }
    service.kafkaService.consumeMessages(context)
    // Producer

    context.payloads = [
        { topic: 'topic1', messages: 'hi', partition: 0 },
        { topic: 'topic2', messages: ['hello', 'world'] }
    ];

    try {
        await service.kafkaService.produceMessages(context)
        console.log("Kafka messages produced");
    } catch (e) {
        console.error(e)
    }

}

module.exports = {
    produceMessages,
    consumeMessages,
    createTopics
}