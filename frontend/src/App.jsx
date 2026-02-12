import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SenderPage from './pages/SenderPage';
import ValentinePage from './pages/ValentinePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SenderPage />} />
        <Route path="/valentine" element={<ValentinePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
