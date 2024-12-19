const admin = require('firebase-admin')
let serviceAccount = require('./firebase-service-account.json')
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    admin, db: admin.firestore()
}