const express = require("express");
const app = express();

const service = require("./src/service");
const kafka = require("kafka-node");
const { configuration } = service

const context = {
    configuration
}


app.get("/", (req, res) => {
    return res.send("Working!");
});

app.listen(configuration.port, () => {
    console.log("Initializing with configuration", configuration.env);
    console.log('Listening on port ' + configuration.port);
});

init = async () => {
    // https://www.npmjs.com/package/kafka-node
    const kafka = require('kafka-node'),
        Producer = kafka.Producer,
        client = new kafka.KafkaClient({kafkaHost: configuration['kafka-broker']}),
        producer = new Producer(client);
    context.kafka = {
        kafka, producer, client,
    }

    context.topics = [{ topic: 'topic1', partition: 0 }]
    context.callback = message => {
        console.log('success')
    }
    service.kafkaService.consumeMessages(context)

}

init()
    .then(() => console.log("Service started"))
    .catch(err => {
    console.error(err);
})