package com.moolgyan.app

import android.os.Bundle
import com.google.androidbrowserhelper.trusted.LauncherActivity

/**
 * MainActivity for the Mool Gyan Android Application.
 * This class extends LauncherActivity to provide a Trusted Web Activity (TWA) experience.
 * It automatically loads the site defined in the AndroidManifest.xml.
 */
class MainActivity : LauncherActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        // Additional initialization if needed can go here.
    }
}
