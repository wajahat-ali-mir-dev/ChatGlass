# ChatGlass

> **Premium WhatsApp Chat Visualizer & Advanced Analytics Dashboard**

ChatGlass is a state-of-the-art, 100% private, client-side web application designed to parse, visualize, and analyze your WhatsApp chat histories. By transforming raw text logs or media-rich ZIP exports into an immersive, premium dashboard, ChatGlass provides deep insights into communication patterns, behavioral profiling, and interactive stats—all running completely locally in your browser.

---

## 🌟 Key Features

### 1. High-Fidelity Chat Viewer

- **Interactive Chat Interface**: A polished, modern chat interface designed with modern CSS and premium typography.
- **Media Gallery & Viewer**: Seamlessly view images, watch videos, and play audio messages directly inline if your exported chat ZIP contains media attachments.
- **Search & Filters**: Search message contents instantly or filter messages by sender and date ranges.

### 2. Comprehensive Analytics Dashboard

- **Activity Metrics**: View total messages, word count distributions, and average response times.
- **Activity Heatmaps**: Analyze communication trends across hours of the day, days of the week, and months.
- **Interaction Matrix**: Map sender interactions and see who initiates conversations or responds fastest.
- **Lexical & Emoji Insights**: Dive into keyword usage, lexical diversity, and emoji distribution charts.

### 3. Client-Side Persona Dossiers & Behavioral Prediction

- **MBTI Profiling**: Computes Myers-Briggs Type Indicator (MBTI) approximations based on text structures, writing speeds, punctuation habits, and cognitive linguistic clues.
- **Detailed Persona Models**: Scans for message formatting, capitalization quirks (e.g. all lowercase, proper grammar), exclamation patterns, and custom writing style profiles.
- **Behavioral Analytics**: Predicts sender engagement patterns, sentiment balances, and interaction characteristics completely offline.

### 4. Enterprise-Grade Privacy by Design

- **No Uploads, No APIs**: Every operation is performed locally on your device. Your conversations, pictures, and voice clips are never transmitted to any server.

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) (v10 or higher)

### Run Locally

1. **Clone the Repository**

   ```bash
   git clone <repository-url>
   cd chatglass
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Start the Development Server**

   ```bash
   npm start
   ```

   Open [http://localhost:8000](http://localhost:8000) in your web browser.

4. **Build for Production**
   ```bash
   npm run build
   ```
   This generates optimized, production-ready static assets in the `dist/` directory, which can be hosted on any static file server (e.g., Nginx, Netlify, Vercel).

---

## 📂 How to Export Your WhatsApp Chat

To analyze a chat, export your conversation history from your WhatsApp mobile app:

### Android

1. Open the individual or group chat.
2. Tap the three dots (menu) in the top-right corner -> **More** -> **Export chat**.
3. Choose whether to export **Without media** (creates a `.txt` file) or **Include media** (creates a `.zip` file with images, videos, and audio).

### iPhone

1. Open the individual or group chat.
2. Tap the contact name or group subject at the top to open contact info.
3. Scroll down and tap **Export Chat**.
4. Choose **Without Media** (produces a `.txt` file) or **Attach Media** (produces a `.zip` archive).

Once exported, drag and drop the `.txt` or `.zip` file directly into the ChatGlass drop zone.

---

## 🛠️ Technology Stack

- **Framework**: [React](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Jotai](https://jotai.org/) (efficient atomic state)
- **Styling**: [Styled Components](https://styled-components.com/) for CSS-in-JS design tokens
- **Parsing Engine**: [whatsapp-chat-parser](https://www.npmjs.com/package/whatsapp-chat-parser) (npm parser library)
- **Archive Extractor**: [JSZip](https://stuk.github.io/jszip/) (client-side extraction of ZIP exports)
- **Development Tools**: [Vite](https://vite.dev/) (lightning-fast builds and hot-reloads)

---

## 📄 License
