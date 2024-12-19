
const watchCollections = async context => {
    const {configuration, service} = context
    const {collections, db} = configuration

    for (const collectionBinding of collections) {
        db.collection(collectionBinding.collection)
            .limit(5)
            .onSnapshot(snapshot => {
                snapshot.forEach(snapshotData => {
                    const data = snapshotData.data()
                    const message = service.mapper.convertFirebaseDataToKafkaInput(
                        collectionBinding.collection,
                        { id: snapshotData.id,  ...data }
                    )
                    console.log(`Handling entity: ${message.id} messages: ${JSON.stringify(message)}`);
                    service.kafkaService.produceMessages({
                        ...context,
                        payloads: [
                            { topic: collectionBinding.topic, messages: [JSON.stringify(message)] },
                        ]
                    })
                })
            })
    }
}


module.exports = {
    watchCollections
}