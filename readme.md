# Antaeus - Disaster Response Application

![Antaeus Banner](LOGO.png)

## Overview

Antaeus is a comprehensive disaster response platform designed to provide real-time assistance during emergency situations. The application combines interactive maps, AI-powered chat assistance, and emergency reporting tools to help both civilians and emergency management personnel during disaster events.

## Key Features

- **Interactive Disaster Maps**: Visualize disaster areas, evacuation routes, shelters, and danger zones
- **AI-Powered Chat Assistant**: Get immediate answers about emergency procedures, evacuation routes, and safety information using LangChain and OpenAI
- **Voice Emergency Reporting**: Record and submit emergency reports with automatic information extraction and NLP processing
- **Real-time Alerts**: Receive notifications about emergency situations and updates
- **Resource Management**: Track and locate emergency resources like shelters, medical supplies, and evacuation points
- **Admin Dashboard**: Emergency management interface for coordinating response efforts
- **Multi-disaster Support**: Handle various disaster types including floods, fires, earthquakes, and hurricanes
- **Geospatial Analysis**: Backend processing of location data to identify risk areas and optimal evacuation routes

## Technologies Used

### Frontend
- **Framework**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS for interactive mapping
- **UI Components**: shadcn/ui component 
- **State Management**: React Hooks

### Backend
- **Language**: Python 3.10+
- **AI Framework**: LangChain for orchestrating AI workflows
- **LLM Integration**: OpenAI API (GPT-4) for natural language understanding and generation

- **Voice Processing**: Whisper API for speech-to-text conversion
- **Entity Extraction**: Custom NER models for extracting location and emergency details
- **Routing**: OSRM (Open Source Routing Machine) for calculating geospacial tools

## Installation


### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/antaeus-disaster-response.git
   cd antaeus-disaster-response/front
2. Install frontend dependencies:

```shellscript
npm install
# or
yarn install
```


3. Set up frontend environment variables:
Create a `.env.local` file in the root directory with the following variables:

```plaintext
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
NEXT_PUBLIC_API_URL=http://localhost:8000
```




### Backend Setup

1. Navigate to the backend directory:

```shellscript
cd backend
```


2. Create and activate a virtual environment:

```shellscript
python -m venv venv

venv\Scripts\activate

```


3. Install backend dependencies:

```shellscript
pip install -r requirements.txt
```


4. Set up backend environment variables:
Create a `.env` file in the backend directory:

```plaintext
OPENAI_API_KEY=your_openai_api_key
MAPBOX_ACCESS_TOKEN=your_mapbox_token
```


5. Start the backend server:

```shellscript
python chatbot/main_api.py
```


6. Start the frontend development server:

```shellscript
# From the root directory
npm run dev
# or
yarn dev
```


7. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

### User Interface

The app includes:

1. **Dashboard**: Overview of active disasters and tools.
2. **Chat**: AI assistant for guidance and answers.
3. **Map**: Interactive map with disaster areas, shelters, and routes.
4. **Alerts**: Real-time emergency notifications.
5. **Resources**: Information on shelters and supplies.
6. **Voice Report**: Submit emergency reports via voice.

### User Roles

- **Civilian**: Access to emergency tools and information.
- **Admin**: Manage resources and coordinate responses.

### Emergency Mode

- Prioritizes emergency messages.
- Highlights urgent information.
- Enables advanced reporting features.

## Features

### Interactive Maps

- Visualize disaster areas, shelters, and routes.
- Mark danger zones and resources.
- Highlight critical areas with animations.

### AI Chat Assistant

- Answers emergency-related questions.
- Provides location-specific guidance.
- Offers real-time updates and evacuation instructions.

### Voice Reporting

- Converts speech to text using Whisper API.
- Extracts key details like location and emergency type.
- Submits reports and tracks their status.

## Contributing

1. Fork the repository.
2. Create a feature branch (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add your feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Open a Pull Request.

## License

MIT License. See `LICENSE` for details.


