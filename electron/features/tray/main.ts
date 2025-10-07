import maximize from "@electron/assets/icons/maximize";
import rotateCcw from "@electron/assets/icons/rotate-ccw";
import logoWhite from "@electron/assets/logo";
import {
  createTrayIcon,
  createTrayIconWithNotificationDot,
} from "@electron/lib/images";
import { openWindow } from "@electron/lib/windows";
import { Menu, nativeTheme, Tray } from "electron";
import { autoUpdater } from "electron-updater";
import { getDefaultAppUpdateService } from "../app-update";
import { getDefaultTrayService } from "./deps";

const appUpdateService = getDefaultAppUpdateService();
let tray: Tray | null = null;
let isUpdateDownloaded = true;

// checking the preferred theme set
const getTintColor = () =>
  nativeTheme.shouldUseDarkColors ? "#FFFFFF" : "#000000";

const getLogoIcon = () => createTrayIcon(logoWhite, getTintColor());
const getLogoIconWithDot = () =>
  createTrayIconWithNotificationDot(logoWhite, getTintColor());
const maximizeIcon = createTrayIcon(maximize, getTintColor());
const dotIcon = createTrayIcon(rotateCcw, "#FF8A00");

const buildContextMenu = () => {
  const items: (Electron.MenuItemConstructorOptions | Electron.MenuItem)[] = [];

  if (isUpdateDownloaded) {
    items.push({
      icon: dotIcon,
      label: "Restart to install new updates",
      click: () => void appUpdateService.quitAndInstall(),
    });
    items.push({ type: "separator" });
  }

  items.push({
    label: "Capture Text",
    icon: maximizeIcon,
    click: () => {
      const trayService = getDefaultTrayService();
      void trayService.captureTextFromScreen();
    },
  });

  items.push({ type: "separator" });
  items.push({
    label: "About Text Capture...",
    click: () => void openWindow("settings", "/settings/about"),
  });
  items.push({
    label: "Check for Updates...",
    click: async () => {
      await appUpdateService.checkForUpdates();
      void openWindow("settings", "/settings/about");
    },
  });
  items.push({ type: "separator" });
  items.push({
    label: "Settings...",
    click: () => void openWindow("settings", "/settings/general"),
  });
  items.push({ type: "separator" });
  items.push({ label: "Quit", role: "quit" });

  return Menu.buildFromTemplate(items);
};

const getTrayIcon = () =>
  isUpdateDownloaded ? getLogoIconWithDot() : getLogoIcon();

const updateTrayAppearance = () => {
  if (!tray) return;
  tray.setImage(getTrayIcon());
  tray.setContextMenu(buildContextMenu());
};

export const createTray = () => {
  tray = new Tray(getTrayIcon());
  tray.setContextMenu(buildContextMenu());

  // Auto refresh on theme change
  nativeTheme.on("updated", () => updateTrayAppearance());

  // sync to wallpaper changes
  let lastTheme = nativeTheme.shouldUseDarkColors;
  setInterval(() => {
    if (nativeTheme.shouldUseDarkColors !== lastTheme) {
      lastTheme = nativeTheme.shouldUseDarkColors;
      updateTrayAppearance();
    }
  }, 3000);

  // AutoUpdater events
  autoUpdater.on("update-downloaded", () => {
    isUpdateDownloaded = true;
    updateTrayAppearance();
  });
  autoUpdater.on("update-not-available", () => {
    isUpdateDownloaded = false;
    updateTrayAppearance();
  });
  autoUpdater.on("error", () => {
    // if an error occurs, we do not show the badge
    isUpdateDownloaded = false;
    updateTrayAppearance();
  });
};
