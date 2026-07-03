# VibeCheck ✨

VibeCheck is a GenAI-powered platform built for the "Destination Discovery & Cultural Experiences" hackathon challenge. It helps travelers discover destinations and engage with local culture in meaningful, authentic ways. 

The application strictly adheres to hackathon guidelines by avoiding hardcoded data and utilizing real Google Gemini API calls for content generation.

## 🌟 Key Features

- **Origin-Aware Storytelling**: The AI tailors the heritage and history story based on where the user is traveling from. Locals get a nuanced, deep dive, while international travelers get an engaging, welcoming introductory perspective.
- **Dynamic AI-Generated Imagery**: Uses the AI model to generate highly specific visual keywords, which are then used to instantly fetch stunning, AI-generated images for both the stories and the attractions on the fly.
- **Authentic Recommendations**: Uncovers hidden gems, top attractions, local events, and cultural experiences (like foods or crafts to try).
- **Premium Aesthetics**: Features a modern, dark-mode glassmorphic design system that ensures the UI is as impressive as the AI logic.

## 🚀 How to Run Locally

1. **Install Dependencies**:
   Open your terminal and run:
   ```bash
   npm install
   ```

2. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   This will typically start the application on `http://localhost:5173/`. Open this link in your browser.

## 🔑 How to Use (For Evaluators)

To comply with the rule that every feature must genuinely work without fake data, VibeCheck allows you to securely input your own API Key.

1. Open the app in your browser.
2. Click the **"Configure API Key"** button in the top right corner.
3. Paste your real **Google Gemini API Key** and click Save.
4. Enter a Destination (e.g., "Kyoto") and an Origin Country (e.g., "United States"), then click "Check the Vibe". 

## 🛠️ Tech Stack
- **Frontend**: Vanilla JavaScript (ES6), HTML5, CSS3
- **Styling**: Custom Glassmorphic UI with Outfit Typography
- **Icons**: Lucide Icons
- **AI Model**: Google Gemini API (`gemini-1.5-flash`)
- **Images**: Pollinations AI (Dynamic Prompt Generation)
- **Build Tool**: Vite
