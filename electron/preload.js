const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('fitappElectron', {
  isElectron: true,
  exportData: (jsonData) => ipcRenderer.invoke('export-data', jsonData),
  importData: () => ipcRenderer.invoke('import-data'),
  openExternal: (url) => ipcRenderer.invoke('open-external', url)
});
