import './index.css';
import './styles/variables.css';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from './store/store'; // ← взимаме и persistor
import App from './App.tsx';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
    {/* Изчаква localStorage да се хидратира преди да покаже приложението */}
    <PersistGate loading={null} persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>
);
