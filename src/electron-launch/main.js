const electron = require('electron');
const { app, BrowserWindow } = electron;

let mainWindow = null;

/**
 * Quit the application if we are not in MacOS and all the windows are closed
 */
app.on('window-all-closed', _ => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('ready', _ => {
    mainWindow = new BrowserWindow({ width: 1280, height: 720, frame: false });
    mainWindow.loadURL(`file://${app.getAppPath()}/index.htm`);
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
});
