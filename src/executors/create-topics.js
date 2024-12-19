const service = require("../service")
const { configuration } = service

const context = {
    configuration
}


init = async () => {
    // https://www.npmjs.com/package/kafka-node
    const kafka = require('kafka-node'),
        Producer = kafka.Producer,
        client = new kafka.KafkaClient({kafkaHost: configuration['kafka-broker']}),
        producer = new Producer(client);
    context.kafka = {
        kafka, producer, client,
    }

    try {
        context.topics = ['topic1', 'topic2']
        await service.kafkaService.createTopics(context)
        console.log("Kafka messages produced")
    } catch (e) {
        console.error(e)
    }
}

init()
    .then(() => console.log("Service started"))
    .catch(err => {
        console.error(err);
    })