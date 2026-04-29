package com.moolgyan.app

import android.os.Bundle
import com.google.androidbrowserhelper.trusted.LauncherActivity
import android.view.View
import android.view.Window
import android.view.WindowManager

/**
 * MainActivity handles the launch of the Trusted Web Activity.
 * It uses the Android Browser Helper library to open the URL defined in the AndroidManifest.xml in true fullscreen mode.
 */
class MainActivity : LauncherActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        
        // Enable fullscreen mode to hide URL bar
        window.decorView.systemUiVisibility = (
            View.SYSTEM_UI_FLAG_FULLSCREEN or
            View.SYSTEM_UI_FLAG_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY or
            View.SYSTEM_UI_FLAG_LAYOUT_STABLE or
            View.SYSTEM_UI_FLAG_LAYOUT_HIDE_NAVIGATION or
            View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
        )
        
        // Hide the status bar
        window.setFlags(
            WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN
        )
    }
}