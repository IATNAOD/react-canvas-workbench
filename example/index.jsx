import './assets/styles/style.sass';

import { createRoot } from 'react-dom/client';
import React from 'react';

import AppLayout from './components/Layout';

createRoot(document.getElementById('app')).render(<AppLayout />);
