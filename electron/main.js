const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 820,
    minWidth: 900,
    minHeight: 600,
    titleBarStyle: 'hiddenInset',
    vibrancy: 'under-window',
    visualEffectState: 'active',
    backgroundColor: '#0a0e1a',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false
    },
    show: false
  });

  mainWindow.loadFile('index.html');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// Export data: save JSON to file
ipcMain.handle('export-data', async (event, jsonData) => {
  const { filePath } = await dialog.showSaveDialog(mainWindow, {
    title: 'Exportar datos de FitApp',
    defaultPath: `fitapp-backup-${new Date().toISOString().split('T')[0]}.json`,
    filters: [{ name: 'JSON', extensions: ['json'] }]
  });
  if (filePath) {
    fs.writeFileSync(filePath, jsonData, 'utf8');
    return { success: true, filePath };
  }
  return { success: false };
});

// Import data: read JSON from file
ipcMain.handle('import-data', async () => {
  const { filePaths } = await dialog.showOpenDialog(mainWindow, {
    title: 'Importar datos de FitApp',
    filters: [{ name: 'JSON', extensions: ['json'] }],
    properties: ['openFile']
  });
  if (filePaths && filePaths[0]) {
    const data = fs.readFileSync(filePaths[0], 'utf8');
    return { success: true, data };
  }
  return { success: false };
});

// Open external links in default browser
ipcMain.handle('open-external', (event, url) => {
  shell.openExternal(url);
});
