<div align="center">
  
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" />
  <img src="https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E" alt="Vite" />

  <br />
  <br />

  <h1>💍 Wedding Photo Live</h1>
  
  <p>
    <b>A real-time collaborative photo gallery and slideshow for weddings and events.</b>
  </p>

  <p>
    <a href="https://photos-mariage-leonie-liverance.netlify.app/" target="_blank"><strong>✨ Voir le site en direct (Live Demo) ✨</strong></a>
  </p>
  
  <p>
    <a href="#sparkles-features">Features</a> •
    <a href="#rocket-quick-start">Quick Start</a> •
    <a href="#hammer_and_wrench-configuration">Configuration</a> •
    <a href="#handshake-contributing">Contributing</a>
  </p>
</div>

<br/>

> **Note:** This project was developed with the help of AI (Google Gemini). 🤖✨

---

## 📸 About the Project

**Wedding Photo Live** is an interactive web application designed to let guests easily share photos during a wedding or event, and display them in real-time on a large screen (slideshow mode). It features a dedicated **Guest Space** for uploading photos and a **Host Dashboard** for managing the event, generating QR codes, and moderating content.

<img width="1268" height="746" alt="Capture d&#39;écran 2026-07-22 124507" src="https://github.com/user-attachments/assets/c4e84659-99f2-48cf-b14f-aebd3a3fd49f" />
<img width="1278" height="743" alt="Capture d&#39;écran 2026-07-22 124646" src="https://github.com/user-attachments/assets/37683c0c-bc96-4004-ae18-c6b93045f63f" />
<img width="1265" height="742" alt="Capture d&#39;écran 2026-07-22 124623" src="https://github.com/user-attachments/assets/8e90e0f9-c427-4630-a151-3e28aa711240" />

---

## :sparkles: Features

- **📱 Guest Space**: Simple, mobile-friendly interface for guests to snap or upload photos instantly.
- **🖥️ Live Slideshow**: A beautiful, real-time animated slideshow meant to be displayed on a projector.
- **🛡️ Moderation Tools**: Hosts can review, approve, or delete photos before they appear on the big screen.
- **📷 QR Code Generator**: Generate printable QR codes for guests to easily access the upload page.
- **⚡ Real-time Sync**: Powered by Firebase Firestore and Storage for instant updates without refreshing.

---

## :rocket: Quick Start

### Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nejy190501/wedding-photo-live.git
   cd wedding-photo-live
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure the environment**
   See the [Configuration](#hammer_and_wrench-configuration) section below to set up Firebase.

4. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:5173`.

---

## :hammer_and_wrench: Configuration

This project relies on **Firebase** (Authentication, Firestore, and Storage).

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
2. Open `.env.local` and add your **Gemini API Key** if needed.
3. Make sure to properly configure your `firebase-applet-config.json` with your Firebase project credentials.
4. Enable **Anonymous Authentication** in your Firebase console.
5. Set up Firestore rules and Storage rules to allow read/write access.

---

## :handshake: Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check out the [issues page](https://github.com/Nejy190501/wedding-photo-live/issues) and read the [CONTRIBUTING.md](./CONTRIBUTING.md) guide.

## :scroll: License

This project is licensed under the [MIT License](./LICENSE).

<div align="center">
  <br/>
  <i>Made with ❤️ for beautiful memories.</i>
</div>
