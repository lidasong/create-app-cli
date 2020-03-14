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
        await spawn('git', ['clone', templateURL, dir])
        spinner.succeed('clone the repo')
    }catch(err){
        spinner.fail('git clone the repo failed')
        throw err
    }
}

async function installDeps(cwd) {
    const spinner = ora(`install the app's dependencies at ${cwd}`).start()
    try {
        await spawn('npm', ['install', '-prefix', cwd])
        spinner.succeed('install ready')
    }catch(err) {
        spinner.fail('install failed')
        throw err
    }
}

module.exports = { fetchRemote, installDeps }