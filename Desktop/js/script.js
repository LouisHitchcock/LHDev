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
        <p>Welcome to my photography portfolio! 📸</p>
        <p>Explore a collection of my best shots, covering landscapes, portraits, and experimental photography.</p>
        <iframe src="https://louishitchcock.photos/" width="100%" height="400px"></iframe>
        <p><a href="https://louishitchcock.photos/" target="_blank">Open in Full Screen</a></p>
    `,

    "Cygnet Bed Tracker": `
        <p>Cygnet Bed Tracker - A hospital bed availability tool 🏥</p>
        <p>This project helps track hospital bed availability in real time, ensuring efficient patient management.</p>
        <iframe src="https://louishitchcock.github.io/cygnetBedSearch/" width="100%" height="400px"></iframe>
        <p><a href="https://louishitchcock.github.io/cygnetBedSearch/" target="_blank">Open in Full Screen</a></p>
    `,

    "FPV Louis": `
        <p>FPV Drone Adventures 🚀</p>
        <p>Follow my high-speed FPV drone flights and immersive aerial experiences.</p>
        <iframe width="100%" height="400px" src="https://www.instagram.com/fpvlouis/embed" frameborder="0"></iframe>
        <p><a href="https://www.instagram.com/fpvlouis/" target="_blank">View on Instagram</a></p>
    `,

    "ESP Espresso": `
        <p>ESP32-Powered Espresso Machine ☕</p>
        <p>A smart coffee project that integrates an ESP32 microcontroller for precise espresso brewing.</p>
        <iframe src="https://github.com/LouisHitchcock/E61-ESP32-Espresso" width="100%" height="400px"></iframe>
        <p><a href="https://github.com/LouisHitchcock/E61-ESP32-Espresso" target="_blank">Open on GitHub</a></p>
    `,

    "Louis Development Portfolio": `
        <p>My Coding & Development Portfolio 💻</p>
        <p>A showcase of my web and software development projects, featuring interactive applications and coding experiments.</p>
        <iframe src="https://louishitchcock.github.io/LHDev/" width="100%" height="400px"></iframe>
        <p><a href="https://louishitchcock.github.io/LHDev/" target="_blank">Open in Full Screen</a></p>
    `,

    "Important Documents": `
        <p>You Did this To Yourself</p>
        <iframe src="https://shattereddisk.github.io/rickroll/rickroll.mp4" width="100%" height="400px"></iframe>
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
