const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  // Add any specific API you need here
  // example: sendNotification: (msg) => ipcRenderer.send('notify', msg)
});
