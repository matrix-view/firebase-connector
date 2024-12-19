const configuration = require('./configuration')

const userService = require('./service/user')
const menuService = require('./service/menu')
const activityService = require('./service/activity')

module.exports = {

    configuration,
    userService,
    menuService,
    activityService,

}