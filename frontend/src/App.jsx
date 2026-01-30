import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StripeProvider } from './Components/Checkout/index.js';
import MainScreen from './Components/Screen/MainScreen.jsx';
import ShopPage from './Components/Screen/ShopPage.jsx';
import ProductDetailPage from './Components/Screen/ProductDetailPage.jsx';
import CheckoutPage from './Components/Checkout/CheckoutPage.jsx';
import OrderConfirmation from './Components/Checkout/OrderConfirmation.jsx';

function App() {
  return (
    <StripeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<MainScreen />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/confirmation" element={<OrderConfirmation />} />
        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;