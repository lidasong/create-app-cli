const spawn = require('cross-spawn')
const ora = require('ora')

function getTemplateURL (type) {
    return {
        node: 'https://github.com/lidasong/create-node-api.git',
        react: 'https://github.com/lidasong/create-webpack-app.git'
    }[type]
}

async function fetchRemote(type, dir) {
    const templateURL = await getTemplateURL(type)
    const spinner = ora(`git clone the ${type} repo from ${templateURL}`).start()
    try {
        spawn.sync('git', ['clone', templateURL, dir])
        spinner.succeed('clone the repo')
    }catch(err){
        spinner.fail('git clone the repo failed')
        throw err
    }
}

async function installDeps(path) {
    const spinner = ora(`install the app's dependencies at ${path}`).start()
    try {
        spawn.sync('cd', [path])
        spawn.sync('cnpm', ['install'])
        spinner.succeed('install ready, you can run your app now')
    }catch(err) {
        spinner.fail('install failed')
        throw err
    }
}

module.exports = { fetchRemote, installDeps }