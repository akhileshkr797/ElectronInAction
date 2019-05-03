const electron = require('electron')
const {app, BrowserWindow, dialog, webContents} = electron
const path = require('path')
const url = require('url')
const fs = require('fs')

let mainWindow

function createWindow(){
    mainWindow = new BrowserWindow({
        show:false,
        width:1300,
        height:800,
        title:'mainWindow'
    })

    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname, 'index.html'),
        protocol:'file:',
        slashes:true
    }))

    mainWindow.once('ready-to-show', ()=>{
        mainWindow.show()
        //getFileFromUser() //open-file when mainWindow is created
    })

    mainWindow.on('close', function(){
        mainWindow = null
    })
}

app.on('ready', ()=>{
    createWindow()
})
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

//sending content from main Process to Renderer process

const getFileFromUser = exports.getFileFromUser = () =>{
    const files = dialog.showOpenDialog(mainWindow, {
        properties:['openFile'],
        filters:[
            {name: ['Text File'], extensions:['txt'] },
            /*
            {name: ['Microsoft Excel Worksheet'], extensions:['xls']},
            {name: ['Microsoft Excel 97-2003 Worksheet'], extensions:['xls']},
            */
            {name: ['markdown'], extensions:['markdown']}
        ]
    })

    if(files){openFile(files[0])}
}

const openFile = (file) =>{
    const content = fs.readFileSync(file).toString()
    mainWindow.webContents.send('file-opened', file, content)
}