# 🎵 [Song Chord Builder](https://guitarsetgo.github.io/Song-Chord-Builder/)

![Version](https://img.shields.io/badge/version-1.0.0-blueviolet)
![Status](https://img.shields.io/badge/status-active-success)

**Song Chord Builder** is a web-based music theory engine and songwriting tool designed for musicians and composers. It allows users to build complex chord progressions using a visual interface, leverage music theory presets, and listen to their compositions in real-time using the Web Audio API.

---

## 🚀 Features

-   **Music Theory Engine:** Select keys and modes (Major, Minor, Dorian, Mixolydian, Lydian, Phrygian) with automatic chord quality calculation.
-   **Visual Song Architecture:** Organize your song into sections (Verse, Chorus, Bridge, etc.) and visualize the entire structure.
-   **Audio Engine:** Real-time playback using a custom polyphonic synthesizer built with the Web Audio API.
-   **Style Presets:** Quickly generate chord palettes for Jazz, Pop, Rock, and Blues.
-   **Project Persistence:** Save your work locally in the browser so you can resume your sessions anytime.
-   **Export Capability:** Export your song data into a portable JSON format.

## 🛠️ Tech Stack

-   **Frontend:** HTML5, CSS3 (Modern UI with custom CSS variables).
-   **Logic:** Vanilla JavaScript (ES6+).
-   **Audio:** Web Audio API for low-latency sound synthesis.
-   **Storage:** LocalStorage API for session persistence.

## 📦 Installation & Usage

Since this is a client-side application, no installation is required.

1.  Clone the repository:
    ```bash
    git clone [https://github.com/guitarsetgo/song-chord-builder.git](https://github.com/guitarsetgo/song-chord-builder.git)
    ```
2.  Open `index.html` in any modern web browser.
3.  **Start Composing:**
    -   Set your BPM and Time Signature.
    -   Add a new section and pick a key/mode.
    -   Click on chords to add them to your progression.
    -   Press **Play** to hear your creation.

---
*Developed by **Joshua Gonzalez** *
