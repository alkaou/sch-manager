import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import './css/app.css';

// Initialize the main application
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Initialize Stagewise toolbar in development mode only
// if (process.env.NODE_ENV === 'development') {
//   import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
//     // Create a container for the toolbar
//     const toolbarContainer = document.createElement('div');
//     toolbarContainer.id = 'stagewise-toolbar-root';
//     document.body.appendChild(toolbarContainer);

//     // Create a separate React root for the toolbar
//     const toolbarRoot = createRoot(toolbarContainer);
    
//     // Configure the toolbar
//     const stagewiseConfig = {
//       plugins: []
//     };

//     // Render the toolbar
//     toolbarRoot.render(<StagewiseToolbar config={stagewiseConfig} />);
//   }).catch(err => {
//     console.error('Failed to load Stagewise toolbar:', err);
//   });
// }

// const root = createRoot(document.body);
// root.render(<App />);