const moment = require('moment')

const constants = require('../../utils/constants')

const configuration = {
    collection: 'activities',
    userCollection: 'users',
}

const updateUserActivitySummaryData = async (context) => {
    const {
        db,
        userUid,
        userActivitySummaryData,
    } = context

    const date = moment().format(constants.dateFormatFirebase)
    userActivitySummaryData.date = date
    await db.collection(configuration.userCollection)
        .doc(userUid)
        .collection(configuration.collection)
        .doc(date)
        .set(userActivitySummaryData, { merge: true })
}



module.exports = {
    updateUserActivitySummaryData
}