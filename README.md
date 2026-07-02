#Project Name: FitAi



A high-performance, commercially viable web system / cross-platform mobile application architected to solve automated athletic scheduling. Developed with a strict focus on rapid deployment pipelines, secure data handling, and fluid user experiences.

---

## 📱 App Previews & Production Layouts

| Main Dashboard / UI | Core Feature / Flow | System Settings / Database Interaction |
| --- | --- |---|
|<img width="237" height="500" alt="Fit-app-HomepageDark" src="https://github.com/user-attachments/assets/e25f8579-86fd-42e2-b672-3f657aa65b8f" />|
<img width="237" height="500" alt="Fitness-App-Ai-Guidance" src="https://github.com/user-attachments/assets/e02bcaa9-f300-41a7-8468-97a0e5af0328" /> | <img width="237" height="500" alt="Profile-Page" src="https://github.com/user-attachments/assets/33c4ad83-e42a-4fd2-9161-251e7c2bcd77" />
  

 

*💡 **Live Deployment:** [👉 Click here to view the live web preview / Expo layout](https://your-deployment-link.com)*

---

## 💼 Commercial Value & Core Use Case

As a developer with nearly a decade of retail operations and commercial management experience, this application was built with business logic at the forefront:

*   **Monetization Ready:** Features a secure, multi-tiered infrastructure handling [webhooks / Stripe subscription pipelines / Clerk role-based access management].
*   **User Retention:** Implements lightweight, global state synchronization using Zustand ensuring sub-100ms UI latency to prevent bounce rates.
*   **Data Integrity:** Workout and exercise data stored in Sanity CMS, scoped per user via Clerk authentication.

---

## ⚡ AI Velocity & Workflow

This project highlights a modern, highly efficient development lifecycle utilizing **AI-augmented pair programming (Cursor)**:
*   Leveraged specialized LLM context prompts to accelerate the prototyping phase of the [database/geospatial API mapping] layer by an estimated 40%.
*   Maintained absolute engineering control over code quality by enforcing modular component structures, dry utility files, and explicit TypeScript declarations.

---

## 🛠 Tech Stack & Architecture

### Frontend & Core Interface
*   **Framework:** React Native via Expo (Expo Router)
*   **Type Safety:** TypeScript (Strict Null Checks)
*   **Styling:** Tailwind CSS / NativeWind

### Backend & Infrastructure
*   **Database & Auth:** Sanity CMS (exercises, workouts, media), Clerk Auth
*   **State Management:** Zustand (with AsyncStorage persistence for active workouts)
*   **Third-Party APIs:** OpenAI API (AI form guidance), Sanity CDN (exercise images)

---

## 🚀 Technical Setup & Installation

Follow these steps to clone and run the application locally in a development environment.

### 1. Prerequisites
Ensure you have the following installed on your machine:
*   Node.js (v18 or higher)
*   npm or yarn
*   [For Mobile Projects]: Expo Go app installed on your physical device, or an Android/iOS simulator configured via Android Studio / Xcode.

### 2. Clone the Repository
```bash
git clone [https://github.com/yourusername/your-repo-name.git](https://github.com/yourusername/your-repo-name.git)
cd your-repo-name

## Deploy

Deploy on all platforms with Expo Application Services (EAS).

- Deploy the website: `npx eas-cli deploy` — [Learn more](https://docs.expo.dev/eas/hosting/get-started/)
- Deploy on iOS and Android using: `npx eas-cli build` — [Learn more](https://expo.dev/eas)

Mobile Development with React Native & Expo
* Cross-platform mobile app development for iOS and Android
* Real-time workout tracking with live timers
* Touch-optimized interface design for mobile devices
* TypeScript for type safety and better development experience
* State management with Zustand for efficient data handling

🗂️ Content Management with Sanity CMS
* Flexible exercise database with images and descriptions
* Rich content editor for exercise instructions
* Media uploads and optimization for demonstration videos
* Custom schemas for fitness content
* Headless CMS for flexible content management

💪 Fitness Tracking Features
* Smart workout tracking with set and rep logging
* Built-in stopwatch for accurate workout duration tracking
* Progress analytics to track fitness journey with detailed statistics
* Comprehensive exercise library with instructions
* Unit flexibility to switch between kg and lbs for weight tracking

🤖 AI Integration & Guidance
* Personalized exercise instructions powered by OpenAI
* AI-powered exercise guidance and tips
* Intelligent workout recommendations
* Real-time AI assistance during workouts

🔒 Authentication & User Management
* Secure authentication with Clerk
* Google OAuth integration
* Protected user data and workout history
* User profile management

🎨 Modern UI/UX Design
* Beautiful interface with NativeWind/Tailwind CSS
* Intuitive tab-based navigation with workout flow
* Consistent design with unified color scheme and typography
* Smooth animations with fluid transitions and micro-interactions
* Loading states with clear feedback during data operations
* Screen reader support and accessible components

🌟 Professional Mobile Features
* Responsive design optimized for all screen sizes
* Mobile-first design approach
* Cross-platform compatibility
* Real-time progress tracking and analytics
