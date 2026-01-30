import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { StripeProvider } from './Components/Checkout/index.js';
import MainScreen from './Components/Screen/MainScreen.jsx';
import ShopPage from './Components/Screen/ShopPage.jsx';
import ProductDetailPage from './Components/Screen/ProductDetailPage.jsx';
import CheckoutPage from './Components/Checkout/CheckoutPage.jsx';
import OrderConfirmation from './Components/Checkout/OrderConfirmation.jsx';
import ProtectedAdminRoute from './Components/UI/ProtectedAdminRoute.jsx';
import {
  AccountLayout,
  AccountPage,
  OrdersPage,
  OrderDetailPage,
  AddressBook,
} from './Components/Account/index.js';
import {
  AdminLayout,
  AdminDashboard,
  ProductsManager,
  OrdersManager,
  UsersManager,
} from './Components/Admin/index.js';
import { WishlistPage } from './Components/Wishlist/index.js';

function App() {
  return (
    <StripeProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<MainScreen />} />
          <Route path="/shop" element={<ShopPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout/confirmation" element={<OrderConfirmation />} />

          {/* Account Routes */}
          <Route path="/account" element={<AccountLayout />}>
            <Route index element={<AccountPage />} />
            <Route path="orders" element={<OrdersPage />} />
            <Route path="orders/:orderId" element={<OrderDetailPage />} />
            <Route path="addresses" element={<AddressBook />} />
          </Route>

          {/* Wishlist Route */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Admin Routes - Protected */}
          <Route element={<ProtectedAdminRoute />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<ProductsManager />} />
              <Route path="orders" element={<OrdersManager />} />
              <Route path="users" element={<UsersManager />} />
            </Route>
          </Route>
        </Routes>
      </Router>
    </StripeProvider>
  );
}

export default App;
