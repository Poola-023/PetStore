/*
import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import PetDetails from './pages/PetDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';

// Vendor Page Imports
import VendorSignup from './pages/VendorSignup';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import VendorOrders from './pages/VendorOrders';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import AllPets from './pages/AllPets';
import UserProfile from './pages/UserProfile';
import VendorProfile from './pages/VendorProfile';
import EditVendorProfile from './pages/EditVendorProfile';
import EditUserProfile from './pages/EditUserProfile';
import UserAddress from './pages/UserAddress';
import AddUserAddress from './pages/AddUserAddress';
import Footer from './pages/Footer';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Centralized Logout Function
  const handleLogout = useCallback(() => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
    // We don't necessarily remove cart from DB, but we clear the local view
  }, []);

  // 2. Session Validation on Refresh
  useEffect(() => {
    const validateSession = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          // Ping backend to see if server still recognizes this user/session
          const res = await fetch(`http://${window.location.hostname}:8080/api/auth/validate/${user.userId}`);
          if (!res.ok) {
            handleLogout();
          }
        } catch (err) {
          console.error("Server unreachable. Logging out for safety.");

        }
      }
      setIsInitializing(false);
    };
    validateSession();
  }, []);

  // 3. Sync Cart with Backend
  useEffect(() => {
    if (user && user.userId) {
      fetch(`http://${window.location.hostname}:8080/api/cart/user/${user.userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Cart sync failed");
          return res.json();
        })
        .then((data) => setCart(data))
        .catch((err) => {
          console.error("Cart sync error:", err);
          setCart([]); // Reset cart if backend data is inaccessible
        });
    } else {
      setCart([]); // Clear cart state if no user is logged in
    }
  }, [user]);

  // 4. Global Function to add pets to cart
  const addToCart = (pet) => {
    setCart((prevCart) => [...prevCart, pet]);
  };

  if (isInitializing) return <div style={{textAlign: 'center', marginTop: '20%'}}>Connecting to Usha Pets...</div>;

  return (
    <Router>
      <Routes>
        {*//*

*/
/* ✨ FIX: Home Component set as default for "/" *//*
*/
/*
}
        {*//*

*/
/*<Route path="/" element={<Home user={user} setUser={setUser} cart={cart} />} />*//*
*/
/*
}
        {*//*

*/
/* User Authentication & Profile *//*
*/
/*
}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {*//*

*/
/* Main Storefront *//*
*/
/*
}
        <Route path="/" element={<Dashboard user={user} setUser={setUser} cart={cart} />} />
        <Route path="/pet-details/:id" element={<PetDetails user={user} cart={cart} addToCart={addToCart} />} />
        <Route path="/pet-details/:id" element={<PetDetails />} />
        {*//*

*/
/* Shopping & Orders *//*
*/
/*
}
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user} />} />
        <Route path="/order-history" element={<OrderHistory user={user} setUser={setUser} cart={cart} />} />
        <Route path="/track-order" element={<TrackOrder user={user} setUser={setUser} cart={cart} />} />

        {*//*

*/
/* Vendor Section *//*
*/
/*
}
        <Route path="/vendor-signup" element={<VendorSignup />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard user={user} setUser={setUser} />} />
        <Route path="/vendor-orders" element={<VendorOrders user={user} />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/edit-pet/:id" element={<EditPet />} />


        <Route path="/all-pets" element={<AllPets user={user} setUser={setUser} cart={cart} />} />


        <Route path="/user-dashboard" element={<UserProfile user={user} />} />
        <Route path="/vendor-profile/:id" element={<VendorProfile />} />
        <Route path="/edit-vendor-profile/:id" element={<EditVendorProfile />} />
        <Route path="/edit-profile" element={<EditUserProfile user={user} setUser={setUser} cart={cart} />} />

        {*//*

*/
/* Catch-all Redirect *//*
*/
/*
}
        <Route path="*" element={<Navigate to="/" />} />

        <Route
                  path="/addresses"
                  element={user ? <UserAddress user={user} setUser={setUser} cart={cart} /> : <Navigate to="/login" />}
                />
                <Route
                  path="/add-address"
                  element={user ? <AddUserAddress user={user} setUser={setUser} cart={cart} /> : <Navigate to="/login" />}
                />
      </Routes>
    </Router>

  );
}

export default App;*//*




import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import PetDetails from './pages/PetDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';

// Vendor Page Imports
import VendorSignup from './pages/VendorSignup';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import VendorOrders from './pages/VendorOrders';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import AllPets from './pages/AllPets';
import UserProfile from './pages/UserProfile';
import VendorProfile from './pages/VendorProfile';
import EditVendorProfile from './pages/EditVendorProfile';
import EditUserProfile from './pages/EditUserProfile';
import UserAddress from './pages/UserAddress';
import AddUserAddress from './pages/AddUserAddress';
import Footer from './pages/Footer';
import CategorySearch from './pages/CategorySearch';

import VendorInventory from './pages/VendorInventory';
import VendorDiscounts from './pages/VendorDiscounts';
import VendorPromos from './pages/VendorPromos';

import ProtectedRoute from './pages/ProtectedRoute';
import ServiceBooking from './pages/ServiceBooking';
import PetCareGuides from './pages/PetCareGuides';
// Add these lines near the top of App.js
import VendorMessages from './pages/VendorMessages';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [cart, setCart] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  // 1. Centralized Logout Function
  const handleLogout = useCallback(() => {
    setUser(null);
    setCart([]);
    localStorage.removeItem('user');
  }, []);



  // 2. Session Validation on Refresh
  useEffect(() => {
    const validateSession = async () => {
      const savedUser = localStorage.getItem('user');
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          const res = await fetch(`http://${window.location.hostname}:8080/api/auth/validate/${user.userId}`);
          if (!res.ok) {
            handleLogout();
          }
        } catch (err) {
          console.error("Server unreachable. Logging out for safety.");
        }
      }
      setIsInitializing(false);
    };
    validateSession();
  }, []);

  // 3. Sync Cart with Backend
  useEffect(() => {
    if (user && user.userId) {
      fetch(`http://${window.location.hostname}:8080/api/cart/user/${user.userId}`)
        .then((res) => {
          if (!res.ok) throw new Error("Cart sync failed");
          return res.json();
        })
        .then((data) => setCart(data))
        .catch((err) => {
          console.error("Cart sync error:", err);
          setCart([]);
        });
    } else {
      setCart([]);
    }
  }, [user]);

  // 4. Global Function to add pets to cart
  const addToCart = (pet) => {
    setCart((prevCart) => [...prevCart, pet]);
  };

  if (isInitializing) return <div style={{textAlign: 'center', marginTop: '20%'}}>Connecting to Usha Pets...</div>;

  return (
    <Router>
      <Routes>
        {*/
/* User Authentication & Profile *//*
}
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />

        {*/
/* Main Storefront *//*
}
        <Route path="/" element={<Dashboard user={user} setUser={setUser} cart={cart} />} />

        {*/
/* ✨ FIXED: Changed path to /pet/:id to match Dashboard clicks, and removed duplicate! *//*
}
        <Route path="/pet/:id" element={<PetDetails user={user} setUser={setUser} cart={cart} addToCart={addToCart} />} />
        <Route path="/pet-details/:id" element={<PetDetails user={user} cart={cart} addToCart={addToCart} />} />
        <Route path="/pet-details/:id" element={<PetDetails />} />
        {*/
/* Shopping & Orders *//*
}
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} user={user} />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} user={user} />} />
        <Route path="/order-history" element={<OrderHistory user={user} setUser={setUser} cart={cart} />} />
        <Route path="/track-order" element={<TrackOrder user={user} setUser={setUser} cart={cart} />} />

        {*/
/* Vendor Section *//*
}
        <Route path="/vendor-signup" element={<VendorSignup />} />
        <Route path="/vendor-login" element={<VendorLogin />} />
        <Route path="/vendor-dashboard" element={<VendorDashboard user={user} setUser={setUser} />} />
        <Route path="/vendor-orders" element={<VendorOrders user={user} />} />
        <Route path="/add-pet" element={<AddPet />} />
        <Route path="/edit-pet/:id" element={<EditPet />} />

        <Route path="/all-pets" element={<AllPets user={user} setUser={setUser} cart={cart} />} />

        <Route path="/user-dashboard" element={<UserProfile user={user} />} />
        <Route path="/vendor-profile/:id" element={<VendorProfile />} />
        <Route path="/edit-vendor-profile/:id" element={<EditVendorProfile />} />
        <Route path="/edit-profile" element={<EditUserProfile user={user} setUser={setUser} cart={cart} />} />
        <Route path="/category/:categoryName" element={<CategorySearch user={user} setUser={setUser} cart={cart} />} />
        <Route path="/vendor-inventory" element={<VendorInventory />} />
        <Route path="/vendor-orders" element={<VendorOrders />} />
        <Route path="/vendor-discounts" element={<VendorDiscounts />} />
        <Route path="/vendor-promos" element={<VendorPromos />} />
        <Route path="/profile" element={<UserProfile user={user} setUser={setUser} cart={cart} />} />

        <Route path="/services" element={<ServiceBooking user={user} setUser={setUser} cart={cart} />} />
        <Route path="/care-guides" element={<PetCareGuides user={user} setUser={setUser} cart={cart} />} />

        <Route
          path="/addresses"
          element={user ? <UserAddress user={user} setUser={setUser} cart={cart} /> : <Navigate to="/login" />}
        />
        <Route
          path="/add-address"
          element={user ? <AddUserAddress user={user} setUser={setUser} cart={cart} /> : <Navigate to="/login" />}
        />

        {*/
/* Catch-all Redirect *//*
}
        <Route path="*" element={<Navigate to="/" />} />


        {*/
/* PUBLIC ROUTES (Anyone can access) *//*
}
        <Route path="/" element={<Home />} />
        <Route path="/all-pets" element={<AllPets />} />
        <Route path="/pet/:id" element={<PetDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vendor-login" element={<VendorLogin />} />

        {*/
/* CUSTOMER ONLY ROUTES *//*
}
        <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <UserProfile user={user} setUser={setUser} cart={cart} />
            </ProtectedRoute>
        } />
        <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <Checkout cart={cart} />
            </ProtectedRoute>
        } />

        {*/
/* VENDOR ONLY ROUTES *//*
}
        <Route path="/vendor-dashboard" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorDashboard />
            </ProtectedRoute>
        } />
        <Route path="/vendor-messages" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorMessages />
            </ProtectedRoute>
        } />

        {*/
/* ADMIN ONLY ROUTES *//*
}
        <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard />
            </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;*/

import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import Login from './pages/login';
import Signup from './pages/signup';
import Dashboard from './pages/Dashboard';
import PetDetails from './pages/PetDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import TrackOrder from './pages/TrackOrder';

// Vendor Page Imports
import VendorSignup from './pages/VendorSignup';
import VendorLogin from './pages/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import VendorOrders from './pages/VendorOrders';
import AddPet from './pages/AddPet';
import EditPet from './pages/EditPet';
import AllPets from './pages/AllPets';
import UserProfile from './pages/UserProfile';
import VendorProfile from './pages/VendorProfile';
import EditVendorProfile from './pages/EditVendorProfile';
import EditUserProfile from './pages/EditUserProfile';
import UserAddress from './pages/UserAddress';
import AddUserAddress from './pages/AddUserAddress';
import CategorySearch from './pages/CategorySearch';
import VendorInventory from './pages/VendorInventory';
import VendorDiscounts from './pages/VendorDiscounts';
import VendorPromos from './pages/VendorPromos';

// Feature Imports
import ProtectedRoute from './pages/ProtectedRoute';
import ServiceBooking from './pages/ServiceBooking';
import PetCareGuides from './pages/PetCareGuides';
import VendorMessages from './pages/VendorMessages';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  // ✨ FIX 1: Lazy initial state ensures user is found BEFORE first render
  // ✨ FIX: Initialize state IMMEDIATELY from localStorage
  const [user, setUser] = useState(() => {
      const savedUser = localStorage.getItem('user');
      try {
          return savedUser ? JSON.parse(savedUser) : null;
      } catch (error) {
          console.error("Error parsing user from storage", error);
          return null;
      }
  });

  const [cart, setCart] = useState([]);
  const [isInitializing, setIsInitializing] = useState(true);

  const handleLogout = useCallback(() => {

    setCart([]);

  }, []);

  // ✨ FIX 2: Session validation MUST send the JWT Token
  const validateSession = async () => {
    const savedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token'); // ✨ Get the token

    if (savedUser && token) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // ✨ ADD THE HEADERS BLOCK BELOW
        const res = await fetch(`http://${window.location.hostname}:8080/api/auth/validate/${parsedUser.userId || parsedUser.id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`, // ✨ This unlocks the 403
            'Content-Type': 'application/json'
          }
        });

        if (!res.ok) {
          handleLogout();
        }
      } catch (err) {
        console.error("Server unreachable.");
      }
    }
    setIsInitializing(false);
  };
  // 2. Session Validation on Refresh
    useEffect(() => {
      const validateSession = async () => {
        const savedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        // If we don't even have a user/token, just stop initializing and show the UI
        if (!savedUser || !token) {
          setIsInitializing(false);
          return;
        }

        try {
          const parsedUser = JSON.parse(savedUser);
          const userId = parsedUser.userId || parsedUser.id;

          const res = await fetch(`http://${window.location.hostname}:8080/api/auth/validate/${parsedUser.userId}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          if (parsedUser.role === 'VENDOR') {
              setIsInitializing(false);
              return; // Let the vendor stay logged in!
          }

          // If the server explicitly says the token is bad, log out
          if (res.status === 401 || res.status === 403) {
            console.warn("Session expired or invalid. Logging out.");
            handleLogout();
          }
        } catch (err) {
          // If backend is down, we don't log out, we just let them stay in
          console.error("Backend unreachable during validation. Maintaining local session.");
        } finally {
          // ✨ CRITICAL FIX: This runs NO MATTER WHAT.
          // Whether the fetch succeeds, fails, or catches an error,
          // we must hide the "Initializing" screen.
          setIsInitializing(false);
        }
      };

      validateSession();
    }, [handleLogout]);

  // Sync Cart
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user && token) {
      fetch(`http://${window.location.hostname}:8080/api/cart/user/${user.userId || user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then((res) => res.ok ? res.json() : [])
        .then((data) => setCart(data))
        .catch(() => setCart([]));
    }
  }, [user]);

  const addToCart = (pet) => setCart((prev) => [...prev, pet]);

  if (isInitializing) return <div style={{textAlign: 'center', marginTop: '20%', fontWeight: 'bold'}}>Initializing Boutique...</div>;

  return (
    <Router>
      <Routes>
        {/* --- PUBLIC ROUTES --- */}
        <Route path="/" element={<Dashboard user={user} setUser={setUser} cart={cart} />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/vendor-login" element={<VendorLogin setUser={setUser} />} />
        <Route path="/vendor-signup" element={<VendorSignup />} />
        <Route path="/all-pets" element={<AllPets user={user} setUser={setUser} cart={cart} />} />
        <Route path="/pet/:id" element={<PetDetails user={user} setUser={setUser} cart={cart} addToCart={addToCart} />} />
        <Route path="/category/:categoryName" element={<CategorySearch user={user} setUser={setUser} cart={cart} />} />
        <Route path="/services" element={<ServiceBooking user={user} setUser={setUser} cart={cart} />} />
        <Route path="/care-guides" element={<PetCareGuides user={user} setUser={setUser} cart={cart} />} />

        {/* --- CUSTOMER PROTECTED ROUTES --- */}
        /*<Route path="/profile" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <UserProfile user={user} setUser={setUser} cart={cart} />
            </ProtectedRoute>
        } />
        <Route path="/user-dashboard" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <UserProfile user={user} setUser={setUser} cart={cart} />
            </ProtectedRoute>
        } />
        <Route path="/cart" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <Cart cart={cart} setCart={setCart} user={user} setUser={setUser} />
            </ProtectedRoute>
        } />
        <Route path="/checkout" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <Checkout cart={cart} setCart={setCart} user={user} />
            </ProtectedRoute>
        } />
        <Route path="/order-history" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <OrderHistory user={user} setUser={setUser} cart={cart} />
            </ProtectedRoute>
        } />
        <Route path="/addresses" element={
            <ProtectedRoute allowedRoles={['CUSTOMER']}>
                <UserAddress user={user} setUser={setUser} cart={cart} />
            </ProtectedRoute>
        } />*/
        <Route path="/user-dashboard" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}><UserProfile user={user} setUser={setUser} cart={cart} /></ProtectedRoute>
                } />
                <Route path="/profile" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}><UserProfile user={user} setUser={setUser} cart={cart} /></ProtectedRoute>
                } />
                <Route path="/addresses" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}><UserAddress user={user} setUser={setUser} cart={cart} /></ProtectedRoute>
                } />
                <Route path="/order-history" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}><OrderHistory user={user} setUser={setUser} cart={cart} /></ProtectedRoute>
                } />
                <Route path="/cart" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}><Cart cart={cart} setCart={setCart} user={user} setUser={setUser} /></ProtectedRoute>
                } />
                <Route path="/checkout" element={
                    <ProtectedRoute allowedRoles={['CUSTOMER']}><Checkout cart={cart} setCart={setCart} user={user} setUser={setUser} /></ProtectedRoute>
                } />

        {/* --- VENDOR PROTECTED ROUTES --- */}
        <Route path="/vendor-dashboard" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorDashboard user={user} setUser={setUser} />
            </ProtectedRoute>
        } />
        <Route path="/vendor-messages" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorMessages user={user} />
            </ProtectedRoute>
        } />
        <Route path="/vendor-inventory" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorInventory user={user} />
            </ProtectedRoute>
        } />
        <Route path="/add-pet" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <AddPet user={user} />
            </ProtectedRoute>
        } />
        <Route path="/edit-pet/:id" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <EditPet user={user} />
            </ProtectedRoute>
        } />
        <Route path="/vendor-orders" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
                <VendorOrders user={user} />
            </ProtectedRoute>
        } />
        <Route path="/vendor-discounts" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
               <VendorDiscounts user={user} />
            </ProtectedRoute>
        } />
        <Route path="/vendor-promos" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
               <VendorPromos user={user} />
            </ProtectedRoute>
        } />
        <Route path="/vendor-profile/:id" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
               <VendorProfile user={user} />
            </ProtectedRoute>
        } />
        <Route path="/edit-vendor-profile/:id" element={
            <ProtectedRoute allowedRoles={['VENDOR']}>
               <EditVendorProfile user={user} />
            </ProtectedRoute>
        } />

        {/* --- ADMIN PROTECTED ROUTES --- */}
        <Route path="/admin-dashboard" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
                <AdminDashboard user={user} />
            </ProtectedRoute>
        } />

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;