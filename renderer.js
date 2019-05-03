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

//re-rendering html when markdown changes
markdownView.addEventListener('keyup', (event) => {
const currentContent = event.target.value;
renderMarkdownToHtml(currentContent);
});

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
const {remote, ipcRenderer} = require('electron')
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
openFileButton.addEventListener('click', ()=>{
    mainProcss.getFileFromUser(currentWindow)
})

//adding listener to newFileButton
newFileButton.addEventListener('click', ()=>{
    mainProcss.createWindow()
})

ipcRenderer.on('file-opened', (event, file, content)=>{
    markdownView.value = content
    renderMarkdownToHtml(content)
})


