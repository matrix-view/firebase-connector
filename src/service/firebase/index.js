
const watchCollections = async context => {
    const {configuration, service} = context
    const {collections, db} = configuration

    for (const collectionBinding of collections) {
        db.collection(collectionBinding.collection)
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    const id = change.doc.id
                    const data = change.doc.data()
                    const type = change.type

                    const message = service.mapper.convertFirebaseDataToKafkaInput(
                        collectionBinding.collection,
                        { id, type,  ...data }
                    )
                    console.log(`[producing message] key: ${id} message: ${JSON.stringify(message)}`);

                    service.kafkaService.produceMessages({
                        ...context,
                        payloads: [
                            {
                                topic: collectionBinding.topic,
                                key: id,
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