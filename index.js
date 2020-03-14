#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const package = require('./package.json');
const {fetchRemote, installDeps} = require('./create')
const del = require('del')
const fs = require('fs')
const projectTypes = ['react', 'node']

let projectType
const program = new commander.Command(package.name)
    .version(package.version)
    .arguments('<project-type>')
    .usage(`${chalk.green('<project-type>')} [options]`)
    .action(type => {
        projectType = type || 'react';
    })
    .option('-h --help');

program.parse(process.argv);

if (program.help) {
    console.log(`cli for custom create react app、 node app\r\n`)
    console.log(`create-app-custom react|node`)
}

if (!projectTypes.includes(projectType)) {
    console.log(chalk.red.bold(`the ${projectType} not support now, we now support ${projectTypes.join('、')}`))
    process.exit()
}

inquirer.prompt([{
    type: 'input',
    name: 'appName',
    message: (answers) => {
        if (!answers.appName) {
            console.log(chalk.bold.yellowBright('the appName default is followed by the original name'))
        }
        console.log(chalk.bold.greenBright(`your app's name is ${answers.appName}`))
    }
},{
    type: 'input',
    name: 'author',
    message: (answers) => {
        if (!answers.author) {
            console.log(chalk.bold.yellowBright('the author will be empty'))
        }
        console.log(chalk.bold.greenBright(`your app's author is ${answers.author}`))
    }
}]).then(async (answers) => {
    try {
        await del(answers.appName)
        fs.mkdirSync(answers.appName)
        await fetchRemote(projectType, answers.appName)
        await del(`${answers.appName}/.git`)
        await installDeps(path.resolve(__dirname, answers.appName))
        process.exit()
    }catch(err) {
        throw err
    }
}).catch(err => {
    console.log(chalk.bold.redBright('some error happends', err))
    process.exit()
})



