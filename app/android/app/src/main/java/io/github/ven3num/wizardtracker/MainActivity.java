package io.github.ven3num.wizardtracker;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // After super.onCreate: it switches from the splash theme to the app theme, and the window must be
        // created with the app theme (before it, a title bar with the splash image showed up on top).
        super.onCreate(savedInstanceState);
        // Draw behind the status and navigation bars on every Android version, like Android 15+ does.
        // The web app keeps its content clear of them with the --safe-* paddings in index.css.
        EdgeToEdge.enable(this);
    }
}
