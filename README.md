# 📸 Computer Vision Studio

An advanced, **real-time browser-based Computer Vision application** with an interactive user interface — perfect as a **final year project**.  
Built using **TensorFlow.js, MediaPipe, and modern web technologies**, this app demonstrates multiple CV capabilities directly in your browser.

---

## 🚀 Features

- **Object Detection** (COCO-SSD Model)
- **Face Detection & Analysis** (with Age/Emotion Estimation)
- **Human Pose Estimation** (MediaPipe Pose)
- **Advanced Image Filters** (Custom Kernel Processing)
- **Real-time Camera Processing** (up to 60 FPS)
- **Batch Image Processing**
- **Professional Dashboard** with FPS tracking & analytics
- **Responsive Dark-Themed UI** with drag-and-drop uploads

---

## 📂 Project Structure

```
.
├── index.html           # Main UI
├── /assets              # Icons, styles, etc.
├── /models              # Pre-trained models
├── /scripts             # JavaScript logic (TensorFlow.js + MediaPipe)
├── styles.css           # Dark theme + responsive styles
```

---

## 🛠️ Installation & Setup

### 1. Clone the Repository
```
git clone https://github.com/Jatingoyal14/computer-vision-studio.git
cd computer-vision-studio
```

### 2. Install Dependencies
This project is front-end based, using CDN imports for **TensorFlow.js** and **MediaPipe**.  
No heavy build tools required. Just open in a browser.

> However, for local camera access to work, you must serve via **HTTPS** or use **Live Server**.

### 3. Run Locally
If you have VS Code, install **Live Server** extension → Right click `index.html` → "Open with Live Server".  
Alternatively, use Python:
```
python -m http.server 8000
```
Go to: [http://localhost:8000](http://localhost:8000)

---

## 🎮 Usage

1. **Allow Camera Access** when prompted.
2. Choose a module from the dashboard:
   - **Camera Mode** → Real-time object, face, or pose detection.
   - **Image Upload Mode** → Drag and drop or select images for analysis.
3. View results on-screen (detected objects, face landmarks, pose lines, filtered images).
4. Download processed images/results.

---

## ⚠️ Troubleshooting

**Camera Access Denied**
- Ensure your browser has camera permissions enabled for the site.
- Use Chrome or Firefox.
- Make sure you are running via HTTPS or localhost.
- Close other apps using the webcam.

**Image Upload Not Working**
- Check browser console for errors (`F12` → Console).
- Ensure images are JPG/PNG and under supported size.
- Verify JavaScript is fully loaded (no missing scripts in `scripts/` folder).

**"Coming Soon" Modules**
- These are placeholders for additional future functionalities (e.g., segmentation, OCR).

---

## 📸 Screenshots

*(Add your screenshots here)*

---

## 🧠 Tech Stack

- **HTML5, CSS3, JavaScript (ES6+)**
- **TensorFlow.js** (Machine Learning in Browser)
- **MediaPipe** (Pose, Face Detection)
- **HTML5 Canvas API**
- **Responsive Web Design**

---

## 📅 Future Improvements
- OCR (Text Detection)
- Background Removal
- Gesture Recognition
- Export Video Processing Feature

---

## 📜 License
This project is licensed under the **MIT License** — you are free to use, modify, and distribute with attribution.

---

## 🙌 Author
Developed by **Jatin Goyal** — Final Year CS Student.  
If you find this project useful, please ⭐ the repo!
