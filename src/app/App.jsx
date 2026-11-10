import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import enUS from 'antd/es/locale/en_US';
import { ScrollToTop } from '../components/ScrollToTop';
import { HomePage } from '../features/home/HomePage';
import { NotFoundPage, OfflinePage } from '../features/state/StatePages';
import { TourDetailPage } from '../features/tours/TourDetailPage';
import { TourListingPage } from '../features/tours/TourListingPage';
import { SiteLayout } from './SiteLayout';

export default function App() {
  return (
    <ConfigProvider locale={enUS} autoInsertSpaceInButton={false}>
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<SiteLayout />}>
            <Route index element={<HomePage />} />
            <Route path="tours" element={<TourListingPage />} />
            <Route path="tours/:slug" element={<TourDetailPage />} />
            <Route path="offline" element={<OfflinePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}
