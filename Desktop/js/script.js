document.addEventListener("DOMContentLoaded", function () {
    updateClock();
    setInterval(updateClock, 1000);

    const icons = document.querySelectorAll(".icon");
    icons.forEach(icon => {
        icon.addEventListener("click", function () {
            const title = this.querySelector("span").innerText;
            const iconSrc = this.querySelector("img").getAttribute("src");
            openWindow(title, iconSrc);
        });
    });
});

function updateClock() {
    const clockElement = document.getElementById("clock");
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    let ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    clockElement.textContent = `${hours}:${minutes} ${ampm}`;
}

const windowContents = {


    "LouisHitchPhotos Portfolio": `
        <p>Welcome to my photography portfolio!</p>
        <img src="./images/LHPhotoScreenshot.png" alt="LouisHitchPhotos screenshot" style="width:100%; margin-bottom: 1rem;" />
        <p>This fully custom-built website showcases a curated collection of my best work in landscape, portrait, and experimental photography. I built the site from scratch to retain full creative control, with a focus on speed, accessibility, and visual impact.</p>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://louishitchcock.photos/" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://louishitchcock.photos/" target="_blank">Open in Full Screen</a></p>
    `,

    "Cygnet Bed Tracker": `
        <p>Cygnet Bed Tracker - Real-time Hospital Bed Monitoring</p>
        <p>This project was designed to address the lack of accessible bed tracking tools in mental health services. It scrapes bed availability data daily from Cygnet Group’s website using a headless browser, storing a historical dataset of up to 365 days. Even the hospital group itself doesn’t retain this level of historical access.</p>
        <img src="./images/cygnetExample.png" alt="Cygnet Bed Tracker preview" style="width:100%; margin-bottom: 1rem;" />
        <p>The backend compares each day’s data to the previous day and dispatches notifications to a Discord channel if changes are detected, along with a daily summary report. In April 2024, the project was updated to bypass new anti-bot measures introduced by Cygnet, ensuring continued functionality.</p>
        <p>All data is served via a simple frontend UI, allowing staff or researchers to quickly view patterns, trends, and fluctuations in bed availability across the network.</p>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://louishitchcock.github.io/cygnetBedSearch/" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://louishitchcock.github.io/cygnetBedSearch/" target="_blank">Open in Full Screen</a></p>
    `,

    "FPV Louis": `
        <p>FPV Drone Adventures</p>

        <p>This is my Instagram portfolio documenting high-speed, cinematic FPV (First-Person View) drone flights. Every clip is filmed, flown, and edited by me, capturing immersive aerial experiences through tight proximity flights, dynamic dives, and location-driven storytelling.</p>
        <p>My footage blends the technical precision of drone piloting with an eye for visual composition. The account also serves as a creative testbed for editing techniques, motion tracking, and content workflows optimized for social media delivery.</p>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://www.instagram.com/fpvlouis/embed" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://www.instagram.com/fpvlouis/" target="_blank">View on Instagram</a></p>
    `,

    "ESP Espresso": `
        <p>ESP32-Powered E61 Espresso Machine</p>
        <p>This project modernises a traditional E61-style espresso machine using embedded IoT technology. Built around an ESP32-S3 microcontroller, it adds volumetric flow control, dual PID-regulated boilers, status indicators, and interactive manual and web-based interfaces.</p>
        <img src="./images/ESPInterface.jpg" alt="ESP32 espresso machine photo or PCB render" style="width:100%; margin-bottom: 1rem;" />
        <p>The system supports manual levers for barista-style control as well as fully programmable brew profiles through a custom-designed web UI. A bespoke PCB routes sensor inputs, solenoid control, and power regulation through a unified plug-and-play system compatible with legacy espresso machines.</p>
        <img src="./images/ESPPCB.PNG" alt="ESP32 espresso machine photo or PCB render" style="width:100%; margin-bottom: 1rem;" />
        <p>It’s a blend of engineering precision, user-centered design, and coffee nerdery—tailored for consistent, high-quality brewing with detailed real-time feedback.</p>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://github.com/LouisHitchcock/E61-ESP32-Espresso" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://github.com/LouisHitchcock/E61-ESP32-Espresso" target="_blank">Open on GitHub</a></p>
    `,

    "Louis Development Portfolio": `
        <p>My Coding & Development Portfolio</p>
        <img src="./images/BlenderModel.png" alt="3D desktop scene preview from Louis Development Portfolio" style="width:100%; margin-bottom: 1rem;" />
        <p>This interactive 3D portfolio is built with React Three Fiber and simulates a fully rendered desk scene. Users can orbit around a virtual workspace where an IBM-style monitor displays a Windows 95-inspired desktop UI.</p>
        <img src="./images/BlenderRendered.png" alt="3D desktop scene preview from Louis Development Portfolio" style="width:100%; margin-bottom: 1rem;" />
        <p>The desktop acts as a navigation hub—each icon opens a different portfolio project inside the simulated OS. It includes realistic occlusion and perspective logic, so the interface reacts as though it’s embedded in the scene. The project combines 3D graphics, UI engineering, and nostalgia in one immersive experience.</p>
        <img src="./images/Win95.png" alt="Windows95 Style UI Element" style="width:100%; margin-bottom: 1rem;" />
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://louishitchcock.github.io/LHDev/" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://louishitchcock.github.io/LHDev/" target="_blank">Open in Full Screen</a></p>
    `,

    "Important Documents": `
        <p>You Did this To Yourself</p>
        <!-- <img src="path/to/rickroll-thumbnail.jpg" alt="Rickroll preview" style="width:100%; margin-bottom: 1rem;" /> -->
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://shattereddisk.github.io/rickroll/rickroll.mp4" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
    `,

    "26A1": `
        <p>26A1 - Emergency Mapping Drone Network</p>
        <!-- <img src="path/to/26a1-preview.jpg" alt="26A1 drone concept render or heatmap mockup" style="width:100%; margin-bottom: 1rem;" /> -->
        <p>Built in response to the Grenfell Tower fire, this prototype system uses 4–6 autonomous drones to form a perimeter around a burning building. Each drone is equipped with LiDAR and thermal imaging, feeding live data to a central computer to construct a real-time 3D heatmap of the structure’s internal temperature zones.</p>
        <p>The drones follow autonomous flight paths with real-time obstacle avoidance and fall detection. The visual data allows fire crews to see where people are trapped or which parts of the structure are most at risk—all without entering the building.</p>
        <p>This project won the Ricardo Prize for Innovation and Technology and earned me the title of UK Young Engineer of the Year in 2018. The name ‘26A1’ refers to the Unicode symbol for lightning.</p>
        <p><a href="https://www.sussexexpress.co.uk/education/gatwick-school-pupil-in-major-science-and-engineering-final-232203" target="_blank">News Coverage</a></p>
    `,

    "Gosling Electrical": `
        <p>Website for Gosling Electrical Services</p>
        <!-- <img src="path/to/gosling-preview.jpg" alt="Screenshot of Gosling Electrical website homepage" style="width:100%; margin-bottom: 1rem;" /> -->
        <p>This custom business website was built for Gosling Electrical, a local electrical contractor. It features a fully responsive layout that adapts fluidly across desktop, tablet, and mobile screens.</p>
        <p>The site includes several informational pages, a contact form that connects directly to the business inbox, and a 'Hall of Shame' gallery showcasing poor electrical work—repurposed and refined from my original photography website's gallery system.</p>
        <p>The site strikes a balance between functionality, speed, and character—providing a professional yet personable experience for new clients.</p>
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://goslingelectricalservices.com/" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://goslingelectricalservices.com/" target="_blank">Open in Full Screen</a></p>
    `,

    "FPVGate": `
        <p><strong>FPVGate - Personal FPV Lap Timer</strong></p>
        <img src="./images/FPVGateRace.png" alt="FPVGate race screen interface" style="width:100%; margin-bottom: 1rem;" />
        
        <p><strong>Project Overview</strong></p>
        <p>FPVGate is a compact, self-contained RSSI-based lap timing solution for 5.8GHz FPV drones, designed for personal practice sessions and training. Built around an ESP32-S3 microcontroller with an RX5808 receiver module, it detects lap times by measuring your drone's video transmitter signal strength as you pass through the gate. No transponders, no complex multi-gate setup—just a single device that tracks your flying performance with professional-grade accuracy.</p>
        
        <p><strong>Project Origins and Development</strong></p>
        <p>This project began as a heavily modified fork of PhobosLT by phobos-, which provided the foundational RSSI-based timing concept. Over extensive development, FPVGate evolved into a significantly enhanced system with modern connectivity, comprehensive race analysis tools, and a polished user interface. The project has grown through active community contributions, most notably from Richard Amiss (@ramiss), who contributed digital FPV band support and improved detection algorithms.</p>
        <p>Development has been continuous since its inception, with regular feature additions, bug fixes, and algorithm refinements based on real-world testing feedback. The current version (v1.5.0) represents over a year of iterative improvements, incorporating lessons learned from both competitive racing and casual practice sessions.</p>
        
        <p><strong>Detection Algorithms and Signal Processing</strong></p>
        <p>The core of FPVGate is its sophisticated 5-stage RSSI filtering pipeline, designed to extract clean lap timing data from noisy RF environments:</p>
        <ul style="text-align: left; margin-left: 2rem;">
            <li><strong>Kalman Filtering:</strong> Adaptive state estimation reduces measurement noise while preserving signal dynamics. The Kalman filter uses proper initialization with process noise covariance tuning to balance responsiveness with stability.</li>
            <li><strong>Median Filter:</strong> Non-linear filter eliminates impulse noise and RF spikes from multipath reflections or interference.</li>
            <li><strong>Moving Average:</strong> Temporal smoothing reduces high-frequency noise components without introducing significant lag.</li>
            <li><strong>Exponential Moving Average (EMA):</strong> Weighted recursive filter provides additional smoothing with configurable time constants.</li>
            <li><strong>Step Limiter:</strong> Rate-of-change constraint prevents spurious jumps from sudden interference or signal dropout.</li>
        </ul>
        <p>The enhanced detection state machine tracks gate crossings through distinct phases: approach (RSSI rises above entry threshold), peak detection (maximum signal strength when closest to gate), and exit (RSSI falls below exit threshold). This three-phase approach minimizes false positives from signal reflections or slow passes near the gate. Version 1.5.0 introduced significant improvements to this algorithm, reducing false triggers while maintaining sub-100ms timing precision.</p>
        
        <img src="./images/FPVGateConfig.png" alt="FPVGate configuration interface" style="width:100%; margin-bottom: 1rem;" />
        
        <p><strong>User Interface and Connectivity</strong></p>
        <p>FPVGate features a modern, mobile-responsive web interface inspired by Mainsail's settings design. The full-screen overlay modal configuration system organizes features into six logical sections: Lap & Announcer Settings, Pilot Info, LED Setup, WiFi & Connection, System Settings, and Diagnostics. The interface adapts seamlessly across desktop, tablet, and mobile devices with horizontal tabs on smaller screens.</p>
        <p>Dual connectivity options provide flexibility for different use cases. The WiFi access point mode works with any device (phone, tablet, laptop) by connecting to the FPVGate network. For zero-latency local operation, USB Serial CDC mode pairs with a cross-platform Electron desktop application, providing identical functionality without network overhead. Both modes share the same WebSocket-based architecture with Server-Sent Events (SSE) for real-time updates.</p>
        <p>The OSD overlay system allows race data to be displayed transparently over live video streams for content creation. The overlay window supports multi-monitor setups, click-through transparency, and customizable positioning—ideal for streaming or recording FPV sessions.</p>
        
        <p><strong>Race Analysis and Data Management</strong></p>
        <p>The race analysis system goes beyond simple lap timing. Real-time gap analysis shows the delta between consecutive laps, with color-coded indicators for improvements or degradation. The fastest lap is automatically highlighted, and the system tracks your fastest 3 consecutive laps (RaceGOW format) for consistency metrics. During a race, live distance tracking displays total distance traveled and distance remaining when a track profile is selected.</p>
        <p>Race history is stored on SD card with individual race files for efficient access and cross-device compatibility. Each race captures complete metadata: pilot name, tags, track association, timestamp, lap times, and total distance. The marshalling mode allows post-race editing—add, remove, edit, or reorder laps with real-time statistics recalculation. An interactive timeline visualizer displays race events with color-coded markers and lap deltas, and a playback system can replay saved races with real-time webhook triggers for testing external integrations.</p>
        <p>The track management system lets you create up to 50 track profiles with names, distances, custom notes, and images. Track selection persists to EEPROM, and races are automatically associated with the active track for historical analysis.</p>
        
        <p><strong>Hardware and Technical Architecture</strong></p>
        <p>The ESP32-S3 microcontroller provides dual-core processing, WiFi connectivity, and USB CDC serial emulation. The RX5808 5.8GHz receiver module requires SPI modification for frequency control, allowing dynamic switching between bands. External WS2812 RGB LEDs provide visual feedback with 10 customizable presets stored in EEPROM. An optional active buzzer adds audio cues for race events.</p>
        <p>Storage architecture prioritizes the microSD card for audio files (multi-voice TTS libraries) and race data, with automatic fallback to LittleFS internal flash. Configuration backup and restore functionality ensures settings can be transferred between devices. The system includes 19 comprehensive self-tests covering hardware peripherals, storage systems, and connectivity.</p>
        <p>Voice announcements use two systems: pre-recorded ElevenLabs voices (4 voice packs included) for natural, high-quality audio, and PiperTTS for low-latency synthesis with phonetic name support. Announcement formats are fully configurable, and all audio playback occurs asynchronously without blocking the timing engine.</p>
        
        <p><strong>Band Support and Integration</strong></p>
        <p>FPVGate supports all major analog FPV bands: Boscam A/B/E, Fatshark, RaceBand, and LowBand—8 channels each with complete frequency tables. Version 1.5.0 added comprehensive digital FPV support: DJI (8 bands), HDZero (4 bands), and WalkSnail (4 bands), totaling 16 digital frequency options. The frequency management system includes proper persistence to the RX5808 module and validation to prevent configuration errors.</p>
        <p>The webhook integration system allows external devices to react to race events. HTTP POST webhooks trigger on race start, race stop, and individual laps, with configurable URLs and granular event filtering. This enables gate LED control, timing displays, or custom automation for multi-gate courses or training facilities.</p>
        
        <p><strong>Development Features</strong></p>
        <p>Built-in diagnostics include a real-time serial monitor accessible through the web interface, displaying structured debug logs with timestamps and severity levels. The circular buffer logging system captures 100 lines with auto-scroll and color-coded output. OTA firmware updates allow field upgrades without USB connections. The codebase uses a transport abstraction layer, making it portable across WiFi, USB serial, and future connectivity options.</p>
        <p>mDNS support provides hostname resolution (fpvgate.local) in both access point and station modes, eliminating the need to remember IP addresses. Configuration versioning ensures automatic migration between schema updates, and the JSON-based config backup system produces human-readable files for manual editing or version control.</p>
        
        <p>Open source under MIT License with extensive documentation including hardware guides, wiring diagrams, feature documentation, and development instructions. Active maintenance continues with community contributions welcomed through GitHub.</p>
        
        <div style="position: relative; width: 100%; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 4px;">
            <iframe src="https://github.com/LouisHitchcock/FPVGate" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;" frameborder="0" allowfullscreen></iframe>
        </div>
        <p><a href="https://github.com/LouisHitchcock/FPVGate" target="_blank">View on GitHub</a> | <a href="https://github.com/LouisHitchcock/FPVGate/releases" target="_blank">Download Latest Release</a></p>
    `
};


function openWindow(title, iconSrc) {
    const windowsContainer = document.getElementById("windows-container");
    const taskbarApps = document.getElementById("taskbar-apps");

    let existingWindow = document.getElementById(`window-${title}`);
    if (existingWindow) {
        restoreWindow(`window-${title}`);
        return;
    }

    const windowElement = document.createElement("div");
    windowElement.classList.add("window");
    windowElement.id = `window-${title}`;
    windowElement.style.top = "50px";
    windowElement.style.left = "50px";
    windowElement.innerHTML = `
        <div class="window-title-bar">
            <div class="title-left">
                <img src="${iconSrc}" class="window-icon">
                <span class="window-title">${title}</span>
            </div>
            <div class="window-buttons">
                <button class="minimize" onclick="minimizeWindow('window-${title}', '${title}')">_</button>
                <button class="close" onclick="closeWindow('window-${title}', '${title}')">X</button>
            </div>
        </div>
        <div class="window-content scrollable">
            ${windowContents[title] || "<p>No content available.</p>"}
        </div>
    `;

    windowsContainer.appendChild(windowElement);
    makeDraggable(windowElement);
    bringToFront(windowElement);

    if (!document.getElementById(`taskbar-${title}`)) {
        const taskbarButton = document.createElement("div");
        taskbarButton.classList.add("taskbar-app");
        taskbarButton.id = `taskbar-${title}`;
        taskbarButton.innerHTML = `<img src="${iconSrc}" class="taskbar-icon"> <span>${title}</span>`;
        taskbarButton.onclick = function () {
            restoreWindow(`window-${title}`);
        };
        taskbarApps.appendChild(taskbarButton);
    }
}

function closeWindow(id, title) {
    document.getElementById(id)?.remove();
    document.getElementById(`taskbar-${title}`)?.remove();
}

function minimizeWindow(id) {
    document.getElementById(id).style.display = "none";
}

function restoreWindow(id) {
    const windowElement = document.getElementById(id);
    if (windowElement) {
        windowElement.style.display = "block";
        bringToFront(windowElement);
    }
}

function bringToFront(element) {
    const windows = document.querySelectorAll(".window");
    windows.forEach(win => win.style.zIndex = "1");
    element.style.zIndex = "10";
}

function makeDraggable(element) {
    let titleBar = element.querySelector(".window-title-bar");
    titleBar.addEventListener("mousedown", function (event) {
        event.preventDefault();
        bringToFront(element);
        let shiftX = event.clientX - element.getBoundingClientRect().left;
        let shiftY = event.clientY - element.getBoundingClientRect().top;

        function moveAt(pageX, pageY) {
            element.style.left = pageX - shiftX + "px";
            element.style.top = pageY - shiftY + "px";
        }

        function onMouseMove(event) {
            moveAt(event.pageX, event.pageY);
        }

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", function () {
            document.removeEventListener("mousemove", onMouseMove);
        }, { once: true });
    });
}
