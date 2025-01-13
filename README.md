# 3D Rotating Circles Application Test Task for SAP

This is a React-based 3D application that renders a cylinder-like structure of rotating circles, where each circle consists of evenly spaced, independently rotating boxes. The project uses **React Three Fiber** and includes interactive features such as hover effects, dynamic box/circle controls, and a "jump" functionality.

## Features

- **Dynamic Cylinder Structure**: The number of circles, boxes per circle, and radius can be adjusted via controls.
- **Interactive Hover and Click Effects**: Stop rotation on hover and jump rotation on click.
- **Animation**: Smooth transitions for adding boxes and circles.
- **Responsive Controls**: Built-in GUI using Leva for easy parameter adjustments.

## Main Technologies Used

- **React with Vite**
- **React Three Fiber (with Three.js)**
- **Leva** (for GUI controls)

## Installation

1. Clone the repository:
   ```bash
   git clone git@github.com:Danzmann/sap-task-3d.git
   cd sap-task-3d
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:5174
   ```
   or the port in which vite opened your local dev app

## File Structure

```plaintext
src/
├── components/
│   ├── Circle.tsx         # Circle component with interactive rotation and hover effects
│   ├── RotatingBox.tsx    # Box component for individual rotation
├── utils/
    ├── boxesGenerator.ts  # Utility function for calculation the creation of each box in a circle
    ├── constants.ts       # Constants for configurations used across the app
    ├── getEnv.ts          # Get environment variables
├── App.tsx                # Main app entry point
├── index.tsx              # React DOM entry point
```

## Usage

### Controls
- **Number of Boxes**: Adjust the number of boxes per circle.
- **Radius**: Modify the radius of the circles.
- **Number of Circles**: Change the number of stacked circles.
- **Auto Change**: Automatically increase/decrease the number of circles in a loop.

### Interaction
- **Hover**: Scale the circle up and stop its rotation.
- **Click**: Rotate the circle forward by 1/3 of a full circle.

## Performance

- Monitoring: r3f-perf is used for monitoring rendering stats.
- Calculations: Expensive calculations and components are memoized and frequent user events debounced.
- Pixel ratio: Devices with limited GPU computation have reduced rendering resolution.
- Low Quality Switch: In the leva controls the user can switch on low quality mode with basic mesh instead of standard

## Future Improvements
- Implement smooth acceleration and deceleration for the jump functionality. 
- Add animations for boxes disappearing.
  - The animation for disappearing would require changes to the code to handle logic being executed
  before the unmount of the component. It's a bit lenghty and tricky so decided to keep it out of this initial version.
- Include more advanced lighting and shadows.
- Performance:
  - Instanced rendering: Performance can be greatly increased for large number of boxes by using this approahc which would
  draw multiple boxes in a single draw call. The reason it is not implemented is due to the need to redo the logic for boxes adding/removing animation,
   and the onHover effects, would be a bit of lengthy work so I leave it for the next version.

## License

This project is open source and available under the [MIT License](LICENSE.md).

