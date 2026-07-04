// src/gemini.js

export async function fetchVibeCheck(destination, originCountry, apiKey) {
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure your Gemini API Key.");
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  const prompt = `
    You are an expert travel and cultural guide.
    The user wants a "VibeCheck" for the destination: "${destination}".
    The user is traveling from: "${originCountry}".

    If the user's origin country is similar or the same as the destination, provide nuanced, deep local insights and storytelling.
    If they are from a different country, provide an engaging, welcoming introductory perspective to the heritage and culture, explaining things they might find surprising.

    Respond STRICTLY with a valid JSON object matching this schema exactly, and nothing else (no markdown wrapping, no comments).
    {
      "tagline": "A short, evocative 6-10 word tagline capturing the destination's essence.",
      "vibeTag": "A 2-word mood tag, e.g. 'Zen Vibe' or 'Coastal Chic'.",
      "climateNote": "A short 2-4 word phrase describing the general climate/season feel, e.g. 'Mild & Misty'. Do not invent a precise live temperature.",
      "storytelling": "A rich, immersive 3-4 sentence story about the destination's history or heritage, tailored to the user's origin.",
      "storyImageKeyword": "A 2-3 word keyword (e.g. 'Kyoto temples', 'Eiffel Tower night') to fetch an image for the story.",
      "heroImageKeyword": "A 2-3 word keyword for a wide cinematic cover image of the destination.",
      "localPerspective": "2-3 sentences on how a LOCAL experiences this destination day-to-day.",
      "visitorPerspective": "2-3 sentences on how a first-time VISITOR should experience it.",
      "attractions": [
        { "name": "Attraction Name", "description": "Why it matters culturally (1-2 sentences).", "imageKeyword": "2-3 word keyword" }
        // exactly 3 items
      ],
      "hiddenGems": [
        { "name": "Hidden Gem Name", "description": "Why it's an authentic, off-the-beaten-path spot (1 sentence).", "area": "Neighborhood or district name, 1-3 words", "imageKeyword": "2-3 word keyword" }
        // exactly 3 items
      ],
      "culturalExperiences": [
        { "name": "Dish or experience name", "tag": "Category, e.g. 'Iconic Dish' or 'Fine Dining'", "priceTier": "$, $$, $$$, or $$$$", "description": "1 sentence description.", "imageKeyword": "2-3 word keyword" }
        // exactly 3 items
      ],
      "localEvents": [
        "A type of local festival or seasonal event to look out for.",
        "A regular local gathering (like a weekend market or music scene)."
        // 2-3 items
      ],
      "quickFacts": {
        "population": "Approximate population, e.g. '1.47 Million'",
        "language": "Primary language(s) spoken",
        "bestTime": "Best time of year to visit, e.g. 'April & November'",
        "currency": "Local currency name and code"
      }
    }
  `;

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      responseMimeType: "application/json"
    }
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || "Failed to fetch from Gemini API");
    }

    const data = await response.json();
    const resultText = data.candidates[0].content.parts[0].text;

    // Parse the JSON
    return JSON.parse(resultText);
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}
