const electron = require('electron')
const { app, BrowserWindow, dialog, webContents,shell } = electron
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

    /*

    //creating window-2
    createWindow()

    */

    /*

    //opening xlxs file

    let filePath = app.getAppPath() + '/sample.xls'
    shell.openExternal(filePath)

    */
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
/*
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
*/

//Responding to external requests to open a file
app.on('will-finish-launching', ()=>{
    console.log('will-finish-launching')
        app.on('open-file', (event,file)=>{
            const win = createWindow();
            win.once('ready-to-show', ()=>{
                openFile(win, file);
            })
        })
})

//Refactoring getFileFromUser() to work with specific Window
const getFileFromUser = exports.getFileFromUser = (targetWindow) =>{
    const files = dialog.showOpenDialog(targetWindow, {
        properties: ['openFile'],
        filters: [
            {name: 'Text Files', extensions: ['txt']},
            {name: 'markdown files', extensions: ['md', 'markdown']},
            {name: 'excel file', extensions: ['xls']}
        ]
    })

    if (files){
        openFile(targetWindow, files[0])
    }
}

/*
//refactoring openFile() to work with a specific window
const openFile = exports.openFile = (targetWindow,file)=>{
    const content = fs.readFileSync(file).toString()
    targetWindow.webContents.send('file-opened', file, content)
}
*/

//setting the represented file in macOS
//Appending to the list of recent documents
const openFile = exports.openFile = (targetWindow, file) =>{
    const content = fs.readFileSync(file).toString();
    app.addRecentDocument(file)//Electron app module provides a method for appending to the OS's list of recently opened documents
    targetWindow.setRepresentedFilename(file); //BW instance hv methods that allows set represented file.
    targetWindow.webContents.send('file-opened', file, content)
}


//saving the output generated in right plane(html)
const saveHtml = exports.saveHtml = (targetWindow, content) =>{
    const file = dialog.showSaveDialog(targetWindow, {
        title: 'save HTML',
        defaultPath: app.getPath('documents'),
        filter:[
            {name: 'HTML files', extendions: ['html', 'htm']}
        ]
    })
    
    if(!file){return;}

    fs.writeFileSync(file, content)

}

// saving the Current file
const saveMarkdown = exports.saveMarkdown = (targetWindow, file, content) =>{
    if(!file){ //If this is a new File without a file path, prompts the user to select a file path with a dialog box
        file = dialog.showSaveDialog(targetWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('documents'),
            filters:[
                {name: 'Markdown Files', extensions: ['md', 'markdown']}
            ]
        })
    }
    if(!file) return //if user selects Cancel in the DialogBox, aborts the function

    fs.writeFileSync(file,content)//writes the contents to fileSystem
    openFile(targetWindow, file)
}