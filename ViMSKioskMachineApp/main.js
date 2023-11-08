const { app, BrowserWindow } = require("electron");
const path = require("path");
const url = require("url");

let win;

function createWindow() {
  // Create the browser window.

  win = new BrowserWindow({
    width: 1000,
    height: 1000,
    kiosk: true,
    backgroundColor: "#ffffff",
    icon: `file://${__dirname}/dist/assets/logo.png`,
  });

  win.loadURL(
    url.format({
      pathname: path.join(__dirname, "dist/ViMSKioskApp/index.html"),
      protocol: "file:",
      slashes: true,
    })
  );
  // win.loadURL(`http://localhost:4200`)

  //// uncomment below to open the DevTools.
  // win.webContents.openDevTools()

  // Event when the window is closed.
  win.on("closed", function () {
    win = null;
  });
}

// Create window on electron intialization
app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function () {
  // On macOS specific close process
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function () {
  // macOS specific close process
  if (win === null) {
    createWindow();
  }
});
