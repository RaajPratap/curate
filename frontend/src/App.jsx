import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainScreen from './Components/Screen/MainScreen.jsx';
import ShopPage from './Components/Screen/ShopPage.jsx';
import ProductDetailPage from './Components/Screen/ProductDetailPage.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/shop" element={<ShopPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;