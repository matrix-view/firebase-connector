const moment = require('moment')

const mapDataCollection = firebaseData => {
    return {
        ...firebaseData,
        dateTime: moment().format('YYYY-MM-DD HH:mm:ss')
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