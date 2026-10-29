import { Capacitor } from '@capacitor/core'
import { App } from '@capacitor/app'
import { KeepAwake } from '@capacitor-community/keep-awake'

// Phone features of the Android/iOS app (app/ in the repo). In a browser tab they do nothing.
const isNative = Capacitor.isNativePlatform()

// Android back button: close what is on top, otherwise send the app to the background (the game is saved)
export function setupNativeApp() {
  if (!isNative) return

  App.addListener('backButton', () => {
    const dialog = document.querySelector('dialog[open]')
    const popover = document.querySelector(':popover-open')
    // Same path as Escape, so the edit sheet still asks before dropping changes
    if (dialog) dialog.dispatchEvent(new Event('cancel', { cancelable: true }))
    else if (popover) popover.hidePopover()
    else App.minimizeApp()
  })
}

// The phone lies on the table for the whole game, so the screen must not turn off
export function keepScreenOn(on) {
  if (!isNative) return
  const request = on ? KeepAwake.keepAwake() : KeepAwake.allowSleep()
  request.catch(() => {
    // Not critical: the screen just follows the phone's timeout
  })
}
