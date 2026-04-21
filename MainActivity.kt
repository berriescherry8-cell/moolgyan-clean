package com.moolgyan.app

import android.os.Bundle
import com.google.androidbrowserhelper.trusted.LauncherActivity

/**
 * MainActivity handles the launch of the Trusted Web Activity.
 * It uses the Android Browser Helper library to open the URL * defined in the AndroidManifest.xml in true fullscreen mode.
 */
class MainActivity : LauncherActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // No extra code needed here. The library handles everything!
    }
}