import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { Tools } from './pages/Tools';
import { ToolDetail } from './pages/ToolDetail';
import { SituationDetail } from './pages/SituationDetail';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

export function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/situations" element={<Navigate to="/" replace />} />
        <Route path="/situations/:slug" element={<SituationDetail />} />
        <Route path="/tools" element={<Tools />} />
        <Route path="/tools/:slug" element={<ToolDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}
