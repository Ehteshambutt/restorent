import "./Assets/vendors/fontawesome-free/css/all.min.css";
import "./Assets/scss/sb-admin-2.scss";
import "bootstrap";
import "./App.css";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/pages/Login";
import Register from "./Components/pages/Register";
import Dashboard from "./Components/pages/Dashboard";
import Home from "./Components/pages/Home";
import ProductPage from "./Components/pages/ProductPage";
import AddProduct from "./Components/pages/AddProduct";
import PageLayout from "./Components/pages/PageLayout";
import OrderPlace from "./Components/pages/customer/OrderPlace";
import Cart from "./Components/pages/customer/Cart";
import axios from "axios";
import Checkout from "./Components/pages/customer/Checkout";
import RegisterBusiness from "./Components/pages/RegisterBusiness";
import Menu from "./Components/pages/Menu";
import Order from "./Components/pages/Order";
import { ToastContainer } from "react-toastify";
import ProtectedRoute from "./Components/protectedroute/ProtectedRoute";
import { toast } from "react-toastify";
import NoPage from "./Components/pages/NoPage";
import Settings from "./Components/pages/Settings";
import Restorent from "./Components/Restourent/Restorent";
import MyFavourite from "./Components/pages/SlickBar/MyFavourite";
import Popular from "./Components/pages/SlickBar/Popular";
function App() {
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  useEffect(() => {
    axios.get("/api/menu").then((res) => {
      setMenuItems(res.data);
    });
  }, []);

  const addItemToCart = (item) => {
    let token = sessionStorage.getItem("token") ? true : false;
    if (token) {
      const product = cart.filter((f) => f.item._id == item._id);
      if (product.length > 0) {
        const getTheproduct = cart.filter((f) => f.item._id === item._id);
        const otherItems = cart.filter((f) => f.item._id !== item._id);
        getTheproduct[0].quantity++;
        otherItems.push(getTheproduct[0]);
        setCart([...otherItems]);
      } else {
        const orderLine = {
          item: item,
          quantity: 1,
        };
        setCart([...cart, orderLine]);
      }
      calculateTotal(cart);
      toast(item.title + " added to cart!");
    } else {
      toast("First you need to login!");
    }
  };
  const removeItemFromCart = (item) => {
    const items = cart.filter((f) => f.item._id !== item);
    setCart(items);
    calculateTotal(cart);
    toast("Remove successfully!");
  };
  const UpdateCart = (item, value) => {
    const updatedData = cart.filter((f) =>
      f.item._id === item ? (f.quantity = value) : f.item._id !== item
    );
    setCart(updatedData);
    calculateTotal(cart);
  };
  const calculateTotal = (cart) => {
    let total = 0;
    cart.map((item) => {
      total += item.item.price * item.quantity;
    });
    return total;
  };
  return (
    <div>
      <ToastContainer />

      <Router>
        <div>
          <Routes>
            <Route exact path="/restourent/:id" element={<Restorent />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/restourent/myfavourite" element={<MyFavourite />} />
            <Route exact path="/restourent/popular" element={<Popular/>} />
            <Route exact path="/register" element={<Register />} />
            <Route
              exact
              path="/register-business"
              element={<RegisterBusiness />}
            />
            {/* <Route exact path="/myorders" element={
              <ProtectedRoute component={OrderPlace} cart={cart} />
            } /> */}
            <Route
              exact
              path="/myorders"
              element={<OrderPlace cart={cart} />}
            />

            {/* <Route exact path="/cart" element={
            <ProtectedRoute component={Cart} cart={cart}
              handleUpdateCartQuantity={UpdateCart}
              handleRemoveItemFromCart={removeItemFromCart}
              calTotal={calculateTotal}
            />} /> */}
            <Route
              exact
              path="/cart"
              element={
                <Cart
                  cart={cart}
                  handleUpdateCartQuantity={UpdateCart}
                  handleRemoveItemFromCart={removeItemFromCart}
                  calTotal={calculateTotal}
                />
              }
            />
{/* New Route */}

            {/* <Route exact path="/checkout" element={
            <ProtectedRoute component={Checkout} cart={cart}
              handleUpdateCartQuantity={UpdateCart}
              handleRemoveItemFromCart={removeItemFromCart}
              calTotal={calculateTotal}
            />} /> */}
            <Route
              exact
              path="/checkout"
              element={
                <Checkout
                  cart={cart}
                  handleUpdateCartQuantity={UpdateCart}
                  handleRemoveItemFromCart={removeItemFromCart}
                  calTotal={calculateTotal}
                />
              }
            />
            <Route
              exect
              path="/dashboard"
              element={
                <PageLayout>
                  <ProtectedRoute component={Dashboard} />
                </PageLayout>
              }
            />

            <Route
              exact
              path="/menu"
              element={
                <PageLayout>
                  <ProtectedRoute component={Menu} />
                </PageLayout>
              }
            />
            <Route
              exact
              path="/product/:id"
              element={
                <ProductPage cart={cart} handleAddItemToCart={addItemToCart} />
              }
            />
            <Route
              exact
              path="/cart"
              element={
                <ProtectedRoute
                  component={Cart}
                  cart={cart}
                  handleUpdateCartQuantity={UpdateCart}
                  handleRemoveItemFromCart={removeItemFromCart}
                  calTotal={calculateTotal}
                />
              }
            />
            <Route
              exact
              path="/orders"
              element={
                <PageLayout>
                  <ProtectedRoute component={Order} />
                </PageLayout>
              }
            />
            <Route
              exact
              path="/addproduct"
              element={
                <PageLayout>
                  <ProtectedRoute component={AddProduct} />
                </PageLayout>
              }
            />
            <Route
              exact
              path="/settings"
              element={
                <PageLayout>
                  <ProtectedRoute component={Settings} />
                </PageLayout>
              }
            />
            <Route
              exact
              path="/restourent"
              element={
                <Home
                  menuItems={menuItems}
                  isLoading={false}
                  cart={cart}
                  handleAddItemToCart={addItemToCart}
                  handleRemoveItemFromCart={removeItemFromCart}
                />
              }
            />
            <Route path="*" element={<Restorent />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}
export default App;
