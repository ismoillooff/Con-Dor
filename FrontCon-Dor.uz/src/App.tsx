import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './theme-overrides.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import TrustBar from './components/TrustBar/TrustBar';
import Categories from './components/Categories/Categories';
import Highlights from './components/Highlights/Highlights';
import PromoBanner from './components/PromoBanner/PromoBanner';
import Recommendations from './components/Recommendations/Recommendations';
import DiscoverWorld from './components/DiscoverWorld/DiscoverWorld';
import History from './components/History/History';
import StatsCounter from './components/StatsCounter/StatsCounter';
import Favourites from './components/Favourites/Favourites';
import VideoSection from './components/VideoSection/VideoSection';
import Newsletter from './components/Newsletter/Newsletter';
import Testimonials from './components/Testimonials/Testimonials';
import BrandPartners from './components/BrandPartners/BrandPartners';

import FAQ from './components/FAQ/FAQ';
import Support from './components/Support/Support';
import Footer from './components/Footer/Footer';
import CategoryPage from './components/CategoryPage';
import ProductPage from './components/ProductPage';
import CartPage from './components/CartPage';
import ContactPage from './components/ContactPage';
import LocationsPage from './components/LocationsPage';
import AdminApp from './admin/AdminApp';

import { CartProvider } from './context/CartContext';
import { SettingsProvider } from './context/SettingsContext';
import { LanguageProvider } from './context/LanguageContext';
import { Toaster } from 'react-hot-toast';

function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <Categories />
      <Highlights />
      <PromoBanner />
      <Recommendations />
      <DiscoverWorld />
      <History />
      <StatsCounter />
      <Favourites />
      <VideoSection />
      <Newsletter />
      <Testimonials />
      <BrandPartners />

      <FAQ />
      <Support />
    </>
  );
}

function MainSite() {
  return (
    <>
      <div className="sticky-header">

        <Navbar />
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:slug" element={<CategoryPage />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/locations" element={<LocationsPage />} />
      </Routes>
      <Footer />
    </>
  );
}

function App() {
  // Check if current path starts with /own — render admin panel standalone
  const isAdmin = window.location.pathname.startsWith('/own');

  if (isAdmin) {
    return <AdminApp />;
  }

  return (
    <LanguageProvider>
      <SettingsProvider>
        <CartProvider>
          <Toaster position="bottom-right" reverseOrder={false} />
          <BrowserRouter>
            <MainSite />
          </BrowserRouter>
        </CartProvider>
      </SettingsProvider>
    </LanguageProvider>
  );
}

export default App;
