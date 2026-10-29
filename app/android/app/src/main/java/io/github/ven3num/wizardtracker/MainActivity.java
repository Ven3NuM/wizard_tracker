package io.github.ven3num.wizardtracker;

import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        // Draw behind the status and navigation bars on every Android version, like Android 15+ does.
        // The web app keeps its content clear of them with the --safe-* paddings in index.css.
        EdgeToEdge.enable(this);
        super.onCreate(savedInstanceState);
    }
}
