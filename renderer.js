const marked = require('marked');

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

//converting markdown to html
const renderMarkdownToHtml = (markdown) => {
    htmlView.innerHTML = marked(markdown, { sanitize: true });
};

/*

//re-rendering html when markdown changes
markdownView.addEventListener('keyup', (event) => {
const currentContent = event.target.value;
renderMarkdownToHtml(currentContent);
});

*/

//open-file button
openFileButton.addEventListener('click', () => {
    alert('You clicked OPEN_FILE button')
})

/*
//importing a function from basic-math.js
const basicMath = require('./basic-math')
const m = basicMath.addTwo(4)
markdownView.innerHTML = m

*/

/*
//requiring functions from main process
const {remote} = require('electron')
const mainProcss = remote.require('./main.js')

//Trigger getFileFromUser() in main.js from UI
openFileButton.addEventListener('click', ()=>{
    mainProcss.getFileFromUser()
})

*/

// receiving the contents from main Procss and displaying it in markdown-textarea
const { remote, ipcRenderer } = require('electron')
const mainProcss = remote.require('./main.js')

/*
//Trigger getFileFromUser() in main.js from UI
openFileButton.addEventListener('click', ()=>{
    mainProcss.getFileFromUser()
})

//listing for message on the file-opened channel
ipcRenderer.on('file-opened', (event, file, content)=>{
    markdownView.value = content
    renderMarkdownToHtml(content)
})
*/

//getting reference to the current window
const currentWindow = remote.getCurrentWindow()
    //passing reference to the current Window
openFileButton.addEventListener('click', () => {
    mainProcss.getFileFromUser(currentWindow)
})

//adding listener to newFileButton
newFileButton.addEventListener('click', () => {
    mainProcss.createWindow()
})


/*
ipcRenderer.on('file-opened', (event, file, content)=>{
        markdownView.value = content
        renderMarkdownToHtml(content)
})

*/


//Handling files
//keeping Track of files(opening, making changes in file..)

let filePath = null;
let originalContent = '';

ipcRenderer.on('file-opened', (event, file, content) => {
    filePath = file; //update the path of currently opened file
    originalContent = content; //update the original content to determine if the file has unsavesd

    markdownView.value = content; //Update markdown content to UI
    renderMarkdownToHtml(content); //update HTML content to UI

    //calls a method that updates the window's title bar whenever a new file is opened
    updateUserInterface()
})

//updating the window title based on current file
const path = require('path')

const updateUserInterface = (isEdited) => {
    let title = 'Fire Sale';
    if (filePath) {
        title = `${path.basename(filePath)} - ${title}`;
    }

    if (isEdited) {
        title = `${title} (Edited)`
    }

    //if isEdited is true then update the window accordingly
    currentWindow.setTitle(title);
    currentWindow.setDocumentEdited(isEdited);

    //enabling the 'Save' and 'Revert' button when there are unsaved changes
    saveMarkdownButton.disabled = !isEdited
    revertButton.disabled = !isEdited
}

//Checking for changes whenever user types
markdownView.addEventListener('keyup', (event) => {
    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);

    //whenever the user inputs a keyStroke into the Markdown View, checks to see if the current content mastched..
    //..and update the UI accordingly
    updateUserInterface(currentContent !== originalContent)
})

//triger save File dialogBox for saveHtml
saveHtmlButton.addEventListener('click', () => {
    mainProcss.saveHtml(currentWindow, htmlView.innerHTML)
})

//saveMarkdown button
saveMarkdownButton.addEventListener('click', () => {
    mainProcss.saveMarkdown(currentWindow, filePath, markdownView.value)
})

//Revert File
//reverting content to UI to last saved content
revertButton.addEventListener('click', () => {
    markdownView.value = originalContent;
    renderMarkdownToHtml(originalContent);
})

//drag-and-drop foundation
document.addEventListener('dragstart', event => event.preventDefault());
document.addEventListener('dragover', event => event.preventDefault());
document.addEventListener('dragleave', event => event.preventDefault());
document.addEventListener('drop', event => event.preventDefault());

//