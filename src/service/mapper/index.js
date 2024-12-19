const mapDataCollection = firebaseData => {
    return {
        ...firebaseData
    }
}

const convertFirebaseDataToKafkaInput = (collection, firebaseData) => {
    switch (collection) {
        case 'data':
            return mapDataCollection(firebaseData)
    }
    return firebaseData
}


module.exports = {
    convertFirebaseDataToKafkaInput
}