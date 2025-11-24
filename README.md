# ShapeWrapper 3D

An interactive 3D platform where users can explore prebuilt shapes, apply custom textures (via upload or AI generation), and manipulate texture mapping in real-time.

## Demo

![ShapeWrapper3DQuickDemo](https://github.com/user-attachments/assets/bfd83f82-abca-4563-baec-9be9a17d7e24)

## Workflow

1.  **Select a Shape**: The user clicks "Heart" from the sidebar. A 3D heart appears in the center, rotating slowly.
2.  **AI Texture Generation**: The user clicks the "AI Gen" tab, types "cyberpunk neon circuit board", and hits Generate.
3.  **Application**: Seconds later, the heart is wrapped in a glowing circuit pattern.
4.  **Adjustment**: The user opens "Adjustments", increases the tiling (Repeat X/Y) to make the pattern smaller, and rotates the texture 45 degrees to align with the shape's curves.
5.  **Interaction**: The user pauses the auto-rotation, grabs the shape with the mouse, and spins it to inspect the back.

## How to Use

### 1. On Google AI Studio (Web)
*   **API Key**: Ensure you have a valid Google Gemini API Key in your environment variables.
*   **Run**: Click the "Run" or "Preview" button. The app handles dependency installation automatically.
*   **Interact**: Use the right-hand control panel to switch shapes and textures.

### 2. Local Development
To run this project on your local machine:

**Prerequisites:** Node.js (v18+)

1.  **Clone & Install**
    ```bash
    git clone <repository-url>
    cd shapewrapper-3d
    npm install
    ```

2.  **Environment Setup**
    Create a `.env` file in the root directory:
    ```env
    API_KEY=your_google_gemini_api_key_here
    ```

3.  **Start Dev Server**
    ```bash
    npm start
    # Open http://localhost:1234 (or whichever port is assigned)
    ```

## Features

*   **Multi-Shape Support**: Cube, Sphere, Pyramid, Torus, Icosahedron, and a custom Heart shape.
*   **Texture Engine**:
    *   **Upload**: Drag and drop your own images.
    *   **AI Generation**: Powered by Google Gemini (`gemini-2.5-flash-image`) to generate seamless textures from text prompts.
*   **Advanced Mapping**:
    *   **Tiling**: Control texture repetition (Repeat X/Y).
    *   **Offset**: Shift texture position (Offset X/Y).
    *   **Rotation**: Rotate the texture on the UV map.
*   **Scene Control**:
    *   Auto-rotation toggle (Play/Pause).
    *   Rotation speed and direction controls.
    *   Orbit controls (Zoom/Pan/Rotate).

## Use Cases

1.  **Game Asset Prototyping**: Quickly test how different texture styles look on primitive shapes before modeling complex assets.
2.  **Material Design**: Visualizing seamless patterns (fabrics, wallpapers) on 3D surfaces.
3.  **Creative Exploration**: Generating unique 3D art pieces using AI textures.
4.  **Education**: Teaching UV mapping concepts (tiling, offset, rotation) interactively.

## Tech Stack

*   **Frontend**: React, TypeScript, Tailwind CSS
*   **3D Engine**: Three.js, React Three Fiber, Drei
*   **AI**: Google GenAI SDK (Gemini)
*   **Icons**: Lucide React
