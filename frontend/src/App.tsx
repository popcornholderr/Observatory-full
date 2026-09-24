import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Analysis from './pages/Analysis';
import Results from './pages/Results';
import CitizenScience from './pages/CitizenScience';
import About from './pages/About';
import NasaUplink from './pages/NasaUplink';
import AiModelsLab from './pages/AiModelsLab';
import IntroSplash from './components/IntroSplash';

function App() {
  return (
    <BrowserRouter>
      <IntroSplash />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analyze" element={<Analysis />} />
          <Route path="/nasa-uplink" element={<NasaUplink />} />
          <Route path="/ai-models" element={<AiModelsLab />} />
          <Route path="/citizen-science" element={<CitizenScience />} />
          <Route path="/results/:id" element={<Results />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;

