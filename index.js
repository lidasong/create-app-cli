#!/usr/bin/env node

const commander = require('commander')
const path = require('path')
const inquirer = require('inquirer')
const chalk = require('chalk')
const package = require('./package.json');
const { fetchRemote, installDeps } = require('./create')
const del = require('del')
const fs = require('fs')
const projectTypes = ['react', 'node']

let projectType
const program = new commander.Command(package.name)
    .version(package.version)
    .help(() => {
        return `
        this cli for creating ${chalk.yellowBright('react app、 node app')}
        you can create app like ${chalk.bold.green('reate-app-custom react')} for react app
        or you can create app like ${chalk.bold.green('reate-app-custom node')} for node server\r\n`  
    })
    .arguments('<project-type>')
    .usage(`${chalk.green('<project-type>')} [options]`)
    .action(type => {
        projectType = type || 'react';
    });

program.parse(process.argv);

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
}, {
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
        // await installDeps(path.resolve(__dirname, answers.appName))
        process.exit()
    } catch (err) {
        throw err
    }
}).catch(err => {
    console.log(chalk.bold.redBright('some error happends', err))
    process.exit()
})



