
## Table of Contents

- [Introduction](#introduction)
- [Key Features](#key-features)
- [Technical Architecture](#technical-architecture)
- [Setup and Installation](#setup-and-installation)
- [User Guide](#user-guide)
- [Admin Guide](#admin-guide)
- [Customization](#customization)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)


## Introduction

Antaeus is a comprehensive disaster response and crisis management platform designed to facilitate coordination between emergency responders and affected individuals during natural disasters and other crisis situations. The platform provides real-time information, resource management, and communication tools to help communities prepare for, respond to, and recover from emergencies.

### Purpose

- **Disaster Preparedness**: Provide communities with tools to prepare for potential disasters
- **Response Coordination**: Facilitate coordination between emergency services, volunteers, and affected individuals
- **Risk Minimization**: Help minimize risks and casualties through timely information and resource allocation
- **Recovery Support**: Support post-disaster recovery efforts with resource management and status tracking


## Key Features

### For Affected Individuals (User Role)

1. **Interactive Emergency Map**

1. View nearby shelters, danger zones, and evacuation routes
2. Get real-time updates on disaster developments
3. Find resource distribution points and medical facilities



2. **AI-Powered Chat Assistant**

1. Get personalized guidance during emergencies
2. Ask questions about evacuation procedures, shelter locations, etc.
3. Report emergencies and receive immediate assistance



3. **Voice Emergency Reporting**

1. Record audio descriptions of emergency situations
2. AI extracts key information (location, emergency type, severity)
3. Updates map and notifies emergency services automatically



4. **Real-time Alerts and Notifications**

1. Receive floating notifications for critical alerts
2. Get updates on changing conditions (weather, evacuation orders, etc.)
3. Customize notification preferences



5. **Resource Requests**

1. Request emergency supplies (water, food, medical supplies)
2. Track request status and estimated delivery times
3. Find nearby distribution centers





### For Emergency Responders (Admin Role)

1. **Command Center Dashboard**

1. Overview of active incidents, deployed teams, and affected areas
2. Resource allocation and distribution tracking
3. Real-time statistics and status updates



2. **Team Management**

1. Deploy and track response teams
2. Assign missions and track progress
3. Facilitate team communication



3. **Resource Management**

1. Track inventory of emergency supplies
2. Manage distribution centers and supply chains
3. Process and prioritize resource requests



4. **Alert Management**

1. Issue emergency alerts and evacuation orders
2. Target alerts to specific geographic areas
3. Monitor alert acknowledgments and compliance



5. **Situation Map**

1. Comprehensive view of the disaster area
2. Track incidents, resources, and team locations
3. Analyze disaster impact and plan response strategies





## Technical Architecture

Antaeus is built using modern web technologies:

- **Frontend**: Next.js with App Router, React, TypeScript, and Tailwind CSS
- **UI Components**: shadcn/ui component library
- **State Management**: React hooks and context
- **Maps**: Integration with mapping APIs (Mapbox)
- **Notifications**: Custom notification system with animations
- **Voice Processing**: Audio recording and processing capabilities


### Component Structure

```plaintext
components/
├── admin-dashboard.tsx       # Dashboard for emergency responders
├── alerts-panel.tsx          # Alerts and notifications management
├── audio-report.tsx          # Voice emergency reporting
├── chat-interface.tsx        # Main application interface
├── disaster-map.tsx          # Legacy map component
├── map-component.tsx         # Enhanced map with API integration
├── navbar.tsx                # Application navigation
├── notification-system.tsx   # Floating notification system
├── resources-panel.tsx       # Resource management interface
├── role-selector.tsx         # User/admin role switcher
├── sidebar.tsx               # Application sidebar navigation
├── user-dashboard.tsx        # Dashboard for affected individuals
└── ui/                       # shadcn/ui components
```

## Setup and Installation

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Git


### Installation Steps

1. **Clone the repository**


```shellscript
git clone https://github.com/your-organization/antaeus.git
cd antaeus
```

2. **Install dependencies**


```shellscript
npm install
# or
yarn install
```

3. **Set up environment variables**


Create a `.env.local` file in the root directory with the following variables:

```plaintext
# Map API (replace with your actual API key)
NEXT_PUBLIC_MAPBOX_API_KEY=your_mapbox_api_key

# Optional: Analytics
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

4. **Run the development server**


```shellscript
npm run dev
# or
yarn dev
```

5. **Open your browser**


Navigate to `http://localhost:3000` to see the application running.

## User Guide

### Getting Started as an Affected Individual

1. **Access the platform**: Visit the Antaeus website or open the mobile app
2. **Set your role**: Ensure "Affected Person" is selected in the role selector
3. **Navigate the dashboard**: View nearby resources, active alerts, and emergency instructions
4. **Report an emergency**:

1. Use the "Report Emergency" button
2. Or use the chat interface to describe your situation
3. Or record a voice report with details about your emergency





### Using the Chat Assistant

The AI-powered chat assistant can help with:

- Finding nearby shelters and evacuation routes
- Requesting emergency supplies
- Reporting emergencies
- Getting safety instructions
- Answering questions about the disaster response


As you chat, relevant information will appear on the map beside the chat interface.

### Reading Alerts and Notifications

- Critical alerts appear as floating notifications
- Click on notifications to see more details
- View all active alerts in the Alerts tab
- Set notification preferences in the Alerts settings


### Finding Resources

1. Navigate to the Map tab to see nearby resources
2. Filter the map to show specific resource types (shelters, medical, supplies)
3. Click on map markers to see details about each resource
4. Use the "Get Directions" button to navigate to resources


### Requesting Supplies

1. Navigate to the Resources tab
2. Click "Request Supplies"
3. Fill out the request form with:

1. Type of supplies needed
2. Quantity
3. Delivery location
4. Priority level



4. Submit the request and track its status


## Admin Guide

### Getting Started as an Emergency Responder

1. **Access the platform**: Visit the Antaeus website or open the mobile app
2. **Set your role**: Select "Responder" in the role selector
3. **Navigate the command center**: View active incidents, deployed teams, and resource allocation
4. **Manage the response**: Issue alerts, deploy teams, and allocate resources


### Managing Teams

1. Navigate to the Teams tab
2. View team status, location, and current assignments
3. Create new assignments for teams
4. Track team communications and updates
5. Deploy new teams to specific locations


### Managing Resources

1. Navigate to the Resources tab
2. View current inventory and distribution status
3. Process supply requests based on priority
4. Manage distribution centers and supply chains
5. Track resource allocation and usage


### Issuing Alerts

1. Navigate to the Alerts tab
2. Create a new alert with:

1. Alert type (emergency, weather, update)
2. Affected areas
3. Severity level
4. Expiration time
5. Detailed instructions



3. Monitor alert acknowledgments and compliance


### Using the Situation Map

1. Navigate to the Map tab
2. View all incidents, resources, and team locations
3. Add new markers for incidents or resources
4. Analyze disaster impact and plan response strategies
5. Toggle different map layers for specific information


## Customization

### Adding New Disaster Types

1. Modify the `processMessage` function in `chat-interface.tsx` to handle new disaster types
2. Add appropriate markers and map layers in `map-component.tsx`
3. Update the notification system to include appropriate alerts


### Integrating with External Systems

The platform can be extended to integrate with:

- Emergency alert systems
- Weather services
- Government disaster management systems
- Hospital and medical facility networks
- Supply chain management systems


### Styling and Branding

1. Modify the Tailwind configuration in `tailwind.config.js`
2. Update color schemes and typography
3. Replace logos and imagery
4. Customize component styling in individual component files


## Deployment

### Vercel Deployment

The simplest way to deploy Antaeus is using Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import the project in Vercel
3. Configure environment variables
4. Deploy


### Other Deployment Options

- **Docker**: A Dockerfile is provided for containerized deployment
- **Traditional Hosting**: Build the application with `npm run build` and deploy the resulting files
- **Serverless**: Deploy individual functions to AWS Lambda or similar services


### Scaling Considerations

- Use a CDN for static assets
- Implement database sharding for large-scale deployments
- Consider regional deployments for global disaster response
- Implement caching strategies for map data and frequently accessed information


## Contributing

We welcome contributions to the Antaeus platform! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request


### Development Guidelines

- Follow the existing code style and conventions
- Write tests for new features
- Update documentation as needed
- Ensure accessibility compliance
- Test on multiple devices and browsers


## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## Rebuilding the Platform

If you need to rebuild the Antaeus platform from scratch, follow these steps:

1. **Set up a new Next.js project**


```shellscript
npx create-next-app@latest antaeus --typescript --tailwind --app
cd antaeus
```

2. **Install required dependencies**


```shellscript
npm install lucide-react framer-motion @radix-ui/react-tabs @radix-ui/react-dialog @radix-ui/react-label @radix-ui/react-select @radix-ui/react-switch @radix-ui/react-slot class-variance-authority clsx tailwindcss-animate
```

3. **Set up shadcn/ui**


```shellscript
npx shadcn@latest init
```

4. **Install shadcn/ui components**


```shellscript
npx shadcn@latest add button card input badge tabs progress select switch label
```

5. **Create the component structure**


Create the folders and files according to the component structure outlined in the Technical Architecture section.

6. **Implement the core components**


Start with the fundamental components:

- `dashboard.tsx` (main application interface)
- `notification-system.tsx` (floating notifications)
- `map-component.tsx` (interactive map)
- `sidebar.tsx` (navigation sidebar)


7. **Implement role-specific components**


Create the components for different user roles:

- `user-dashboard.tsx` (for affected individuals)
- `admin-dashboard.tsx` (for emergency responders)
- `role-selector.tsx` (for switching between roles)


8. **Implement feature-specific components**


Add components for specific features:

- `alerts-panel.tsx` (alerts management)
- `resources-panel.tsx` (resource management)
- `audio-report.tsx` (voice reporting)


9. **Configure environment variables**


Set up the necessary environment variables for map APIs and other external services.

10. **Test and deploy**


Test the application thoroughly and deploy using your preferred method.
