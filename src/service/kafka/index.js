const service = require("../../service");



const payloads = [
    {
        topic: 'topic1',
        offset: 0, //default 0
        partition: 0 // default 0
    }
]

const produceMessages = async (context) => {
    const {payloads, configuration} = context

    const kafka = require('kafka-node'),
        Producer = kafka.Producer,
        client = new kafka.KafkaClient({
            kafkaHost: configuration['kafka-broker']
        }),
        producer = new Producer(client);

    return new Promise((resolve, reject) => {
        producer.on('ready', function () {
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
    const {clientOptions, consumerOptions} = configuration.kafka

    const kafka = require('kafka-node'),
        Consumer = kafka.Consumer,
        client = new kafka.KafkaClient({
            kafkaHost: configuration['kafka-broker'],
            ...clientOptions
        }),
        consumer = new Consumer(
            client,
            payloads,
            consumerOptions
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