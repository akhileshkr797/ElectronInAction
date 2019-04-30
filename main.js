const electron = require('electron')
const {app, BrowserWindow} = electron
const path = require('path')
const url = require('url')

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
    })

    mainWindow.on('close', function(){
        mainWindow = null
    })
}

app.on('ready', ()=>{
    createWindow()
})