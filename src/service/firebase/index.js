
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
                    console.log(`[producing message] key: ${message.key} message: ${JSON.stringify(message)}`);
                    service.kafkaService.produceMessages({
                        ...context,
                        payloads: [
                            {
                                topic: collectionBinding.topic,
                                key: message.key,
                                messages: [JSON.stringify(message)]
                            },
                        ]
                    })
                })
            })
    }
}


module.exports = {
    watchCollections
}