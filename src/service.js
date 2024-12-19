const configuration = require('./configuration')

const kafkaService = require('./service/kafka')

const userService = require('./service/user')
const menuService = require('./service/menu')
const activityService = require('./service/activity')

module.exports = {

    configuration,
    userService,
    menuService,
    activityService,
    kafkaService,

}