const menus = require('./menus.json')
const moment = require('moment')

const configuration = {
    collection: 'menus',
}

const updateMenus = async (context) => {
    const {db} = context
    for (const menu of menus) {
        menu.creationTime = new moment()
        menu.creationDate = menu.creationTime .format("DD/MM/YYYY hh:mm:ss")
        await db.collection(configuration.collection).doc(menu.uid).set(menu, { merge: true })
    }
}



module.exports = {
    updateMenus
}