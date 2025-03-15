
# Antaeus - Disaster Response Application

<div align="center">
   <img src="hercule.png" alt="Antaeus Banner" width="250" />
</div>


Antaeus is a cutting-edge disaster response platform designed to provide real-time assistance during emergencies. Combining interactive maps, AI-powered chat assistance, and advanced computer vision models, Antaeus empowers both civilians and emergency personnel to respond effectively to disasters.

---

##  Key Features

- **Interactive Disaster Maps**: Visualize disaster zones, evacuation routes, shelters, and danger areas.
- **AI-Powered Chat Assistant**: Get real-time answers about emergency procedures, evacuation routes, and safety tips using LangChain and OpenAI.
- **Voice Emergency Reporting**: Submit emergency reports via voice with automatic information extraction and NLP processing.
- **Real-time Alerts**: Stay informed with instant notifications about emergencies and updates.
- **Resource Management**: Track and locate critical resources like shelters, medical supplies, and evacuation points.
- **Admin Dashboard**: A centralized interface for emergency management and coordination.
- **Multi-disaster Support**: Handle floods, fires, earthquakes, hurricanes, and more.
- **Geospatial Analysis**: Advanced backend processing for identifying risk areas and optimal evacuation routes.
- **Damage Assessment**:
  - **Siamese Neural Network**: Predicts the degree of damage in disaster-affected areas.
  - **Swin Transformer**: Classifies the type of damage (e.g., flood, earthquake).

---

##  Technologies Used

### Frontend
- **Framework**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS
- **Maps**: Mapbox GL JS for interactive mapping
- **UI Components**: shadcn/ui
- **State Management**: React Hooks

### Backend
- **Language**: Python 3.10+
- **AI Framework**: LangChain for orchestrating AI workflows
- **LLM Integration**: OpenAI API (gpt-4o-mini) for natural language understanding and generation
- **Voice Processing**: Whisper model for speech-to-text conversion
- **Routing**: OSRM (Open Source Routing Machine) for geospatial tools
- **Computer Vision**:
  - **Siamese Neural Network**: Predicts damage severity.
  - **Swin Transformer**: Classifies damage types.

---

##  Installation

### Frontend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/antaeus-disaster-response.git
   cd antaeus-disaster-response/front
   ```

2. Install frontend dependencies:
   ```bash
   npm install --force
   ```

3. Set up frontend environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```plaintext
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
   NEXT_PUBLIC_API_URL=http://localhost:8000
   ```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd chatbot
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install backend dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Set up backend environment variables:
   Create a `.env` file in the backend directory:
   ```plaintext
   OPENAI_API_KEY=your_openai_api_key
   MAPBOX_ACCESS_TOKEN=your_mapbox_token
   ```

5. Start the backend server:
   ```bash
   python chatbot/main_api.py
   ```

6. Start the frontend development server:
   ```bash
   cd front
   npm run dev
   ```

7. Open [http://localhost:3000](http://localhost:3000) in your browser to access the application.

---

##  Usage

### User Interface

The app includes the following components:

1. **Dashboard**: Overview of active disasters and tools.
2. **Chat**: AI assistant for real-time guidance and answers.
3. **Map**: Interactive map with disaster areas, shelters, and evacuation routes.
4. **Alerts**: Emergency notifications and updates.
5. **Resources**: Information on shelters, medical supplies, and evacuation points.
6. **Voice Report**: Submit emergency reports via voice.
7. **Damage Assessment**: View predictions and classifications of damage in affected areas.

### User Roles

- **Civilian**: Access emergency tools and information.
- **Admin**: Manage resources and coordinate response efforts.

### Emergency Mode

- Prioritizes emergency messages.
- Highlights urgent information.
- Enables advanced reporting features.

---

##  Features in Detail

### Interactive Maps
- Visualize disaster areas, shelters, and evacuation routes.
- Mark danger zones and critical resources.
- Highlight risk areas with animations.

### AI Chat Assistant
- Answers emergency-related questions.
- Provides location-specific guidance.
- Offers real-time updates and evacuation instructions.

### Voice Reporting
- Converts speech to text using the Whisper model.
- Extracts key details like location and emergency type.
- Submits reports and tracks their status.

### Damage Assessment
- **Siamese Neural Network**: Predicts the degree of damage in disaster-affected areas.
- **Swin Transformer**: Classifies the type of damage (e.g., flood, earthquake).

---

##  License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.


---

**Antaeus** - Empowering communities to respond to disasters effectively.
