const {app, BrowserWindow} = require('electron');
require('./server');

if (app !== undefined) {
    app.on('ready', createWindow);

    app.on('window-all-closed', () => {
        if (process.platform !== 'darwin') {
            app.quit()
        }
    });

    app.on('activate', () => {
        if (win === null) {
            createWindow()
        }
    });

    let win;

    function createWindow() {
        win = new BrowserWindow({width: 600, height: 600, resizable: false});

        win.loadURL(`http://localhost:9214`);

        // win.webContents.openDevTools();

        win.on('closed', () => {
            win = null
        })
    }
}