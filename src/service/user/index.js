const moment = require('moment')
const activityService = require('../activity')

const configuration = {
    collection: 'typeform',
    userCollection: 'users',
    achievementsCollection: 'achievements',
    emailCollection: 'emails',
    emailSubject: 'Vlumy',
    emailTemplateId: '351ndgwzdvqgzqx8'
}

const updateUserFirestore = async (context) => {
    const {admin, db, user_uid} = context
    context.userData = await admin.auth().getUser(user_uid)
    const user = parseUserData(context.userData)
    await db.collection(configuration.userCollection).doc(context.userData.uid).set(user, { merge: true })
    await handleUserAchievements(context)
}

const createUserFirestore = async (context) => {
    const {db, userData} = context
    if (!userData) {
        throw new Error('User is mandatory')
    }
    const user = parseUserData(userData)
    await db.collection(configuration.userCollection).doc(userData.uid).set(user)
    await handleUserAchievements(context)
    await handleUserEmail(context)

}

const handleUserEmail = async (context) => {
    const {db, userData} = context
    if (!userData || !userData.uid || !userData.email) {
        throw new Error('User is mandatory')
    }
    const {email, uid} = userData
    const dateTime = moment()
    const date = dateTime.format('DD_M_YYYY')
    const collectionUid = `${uid}|${date}`
    return db.collection(configuration.emailCollection).doc(collectionUid).set({
        to: [{ email }],
        subject: configuration.emailSubject,
        template_id: configuration.emailTemplateId,
        date
    })
}

const handleUserAchievements = async (context) => {
    const {userData} = context
    if (!userData) {
        throw new Error('User is mandatory')
    }
    context.achievements = getHomeAchievements()
    await createUserAchievements(context)
}

const createUserAchievements = async (context) => {
    const {db, achievements, userData} = context
    for (const item of achievements) {
        await db
            .collection(configuration.userCollection)
            .doc(userData.uid)
            .collection(configuration.achievementsCollection)
            .doc(item.uid)
            .set(item)
    }
}

const parseUserData = (user) => {
    const {uid, email, displayName, display_name, photoURL, photo_url} = user
    return {
        uid,
        email,
        creationTime: user.metadata.creationTime,
        display_name: displayName || display_name || email.split('@')[0]
    }
}

const getHomeAchievements = () => {
    return [
        {
            uid: 'home_achievement',
            type: 'home',
            isDone: true,
            tittle: 'Programa',
            subTittle: 'MenoPower',
            line1: '1° Dia',
            line2: 'Conquista a medalha completado seu 1° dia.',
            medalText: '1° Dia',
        }
    ]
}

const updateCurrentDayAchievementNextDay = async (context) => {
    const { db, user_uid, day } = context
    await db
        .collection(configuration.userCollection)
        .doc(user_uid)
        .collection(configuration.achievementsCollection)
        .doc('home_achievement')
        .set({
            line1: `${day.day}° Dia`,
            line2: `Realize suas atividades de hoje. Cada pequena conquista é um grande passo na direção do seu bem-estar.`,
            medalText: `${day.day}° Dia`,
        }, { merge: true })
}

const updateCurrentDayAchievement70Percent = async (context) => {
    const { db, user_uid, day, lastDay } = context
    const currentDay = day || lastDay
    if (currentDay) {
        await db
            .collection(configuration.userCollection)
            .doc(user_uid)
            .collection(configuration.achievementsCollection)
            .doc('home_achievement')
            .set({
                line1: `${currentDay.day}° Dia`,
                line2: `Parabéns! Você completou mais da metade das suas atividades de hoje e está na direção certa de um estilo de vida mais saudável.`,
                medalText: `${currentDay.day}° Dia`,
            }, { merge: true })
    }
}

const updateCurrentDayAchievementComplete = async (context) => {
    const { db, user_uid, day } = context
    await db
        .collection(configuration.userCollection)
        .doc(user_uid)
        .collection(configuration.achievementsCollection)
        .doc('home_achievement')
        .set({
            line1: `${day.day}° Dia`,
            line2: `Que Maravilha! Você completou todas as atividades do seu dia. Está empenhada em assumir o controle do seu corpo e mente.`,
            medalText: `${day.day}° Dia`,
        }, { merge: true })
}

const updateCurrentDayAchievementLate = async (context) => {
    const { db, user_uid, day } = context
    await db
        .collection(configuration.userCollection)
        .doc(user_uid)
        .collection(configuration.achievementsCollection)
        .doc('home_achievement')
        .set({
            line1: `${day.day}° Dia`,
            line2: `Persista! Complete suas atividades do Programa Menopower, se comprometa com a sua saúde e siga evoluindo.`,
            medalText: `${day.day}° Dia`,
        }, { merge: true })
}



//  Healthy Intelligence

const updateUserData = async (context) => {
    handleContextData(context)
    try {
        await activityService.updateUserActivitySummaryData(context)
        //     TODO finish
    } catch (e) {
        console.error(e)
        return Promise.reject(e)
    }

}

const handleContextData = (context) => {
    const { userData } = context
    context.userActivitySummaryData = typeof userData.activity === 'string' ? JSON.parse(userData.activity) : userData.activity
//     TODO finish
}


module.exports = {
    createUserFirestore,
    updateUserFirestore,
    updateCurrentDayAchievementNextDay,
    updateCurrentDayAchievement70Percent,
    updateCurrentDayAchievementComplete,
    updateCurrentDayAchievementLate,
    handleUserEmail,
    updateUserData
}