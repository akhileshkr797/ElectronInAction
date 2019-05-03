const electron = require('electron')
const { app, BrowserWindow, dialog, webContents, } = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        show: false,
        width:1300,
        height:800,
        title:'mainWindow'
    });
    mainWindow.loadFile('index.html');
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    //creating window-2
    createWindow()
});
/*
//creating a getFileFromUser()
const getFileFromUser = () =>{
    const files = dialog.showOpenDialog( {
        properties:['openFile'],
        filters:[
            {name: 'Text Files', extensions: ['txt']}
        ]
    })

    if(!files){return}

    const file = files[0]
    const content = fs.readFileSync(file).toString()

    console.log(content)
}

//communicating main with renderer
const getFileFromUser = exports.getFileFromUser = () =>{
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        filters: [
            {name: 'Text Files', extensions:['txt']},
            {name: 'markdown Files', extensions:['markdown']}
        ]
    })

    if(!files){return}

    const file = files[0]
    const content = fs.readFileSync(file).toString()
}

*/
/*
//sending content from main Process to Renderer process

const getFileFromUser = exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog(mainWindow, {
        properties: ['openFile'],
        title: 'OHM Systems Inc',
        filters: [
            { name: ['Text File'], extensions: ['txt'] },
            { name: ['markdown'], extensions: ['markdown'] }
        ]
    })

    if (files) { openFile(files[0]) }
}

const openFile = (file) => {
    const content = fs.readFileSync(file).toString()
    mainWindow.webContents.send('file-opened', file, content)
}
*/


//creating and managing multiple windows
//creating a Set to keep track of new windows
//SETS are a new Data Structure to JS

const windows = new Set();

const createWindow = exports.createWindow = () => {
    let newWindow = new BrowserWindow({ show: false });
    newWindow.loadFile('index.html');
    newWindow.once('ready-to-show', () => {
        newWindow.show();
    });
    newWindow.on('closed', () => {
        windows.delete(newWindow);
        newWindow = null;
    });
    windows.add(newWindow);
    return newWindow;
};

//Refactoring getFileFromUser() to work with specific Window
const getFileFromUser = exports.getFileFromUser = (targetWindow) =>{
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            {name: 'Text Files', extensions: ['txt']},
            {name: 'markdown files', extensions: ['md', 'markdown']}
        ]
    })

    if (files){
        openFile(targetWindow, files[0])
    }
}

//refactoring openFile() to work with a specific window
const openFile = exports.openFile = (targetWindow,file)=>{
    const content = fs.readFileSync(file).toString()
    targetWindow.webContents.send('file-opened', file, content)
}