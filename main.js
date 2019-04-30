const electron = require('electron')
const {app, BrowserWindow, dialog} = electron
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
        getFileFromUser()
    })

    mainWindow.on('close', function(){
        mainWindow = null
    })
}

app.on('ready', ()=>{
    createWindow()
})

//creating a getFileFromUser()
const getFileFromUser = () =>{
    const files = dialog.showOpenDialog({
        properties:['openFile']
    })

    if(!files){
        return
    }

    console.log(files)
}
