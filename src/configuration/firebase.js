const admin = require('firebase-admin')
const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT || require('./firebase-service-account.json')

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

module.exports = {
    admin, db: admin.firestore()
}