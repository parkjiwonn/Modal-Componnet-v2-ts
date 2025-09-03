import React from 'react';
import 'components/common/index.css';
import { ModalProvider } from 'hook/useModal';
import TestPage from 'components/pages/TestPage';

function App() {
  return (
    <ModalProvider>
      <TestPage />
    </ModalProvider>
  );
}

export default App;