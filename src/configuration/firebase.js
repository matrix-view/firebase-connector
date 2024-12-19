const admin = require('firebase-admin')
let serviceAccount = undefined
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
} else {
    try {
        serviceAccount = require('./firebase-service-account.json')
    } catch (e) {
        console.error('Firebase service account not found', e);
    }
}

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    admin, db: admin.firestore()
}