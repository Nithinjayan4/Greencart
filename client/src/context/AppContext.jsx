import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-hot-toast";
import axios from "axios";

axios.defaults.withCredentials = true;
// To enable cookies in requests
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const currency = import.meta.env.VITE_CURRENCY;

  const navigate = useNavigate();
  const [user, setUser] = useState(null); // true
  const [isSeller, setIsSeller] = useState(false);
  const [showUserLogin, setshowUserLogin] = useState(false);
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const [searchQuery, setSearchQuery] = useState(false);

  //fetch seller status

  const fetchSeller = async () => {
    try {
      const { data } = await axios.get("/api/seller/is-auth"); // must be GET

      if (data.success) {
        setIsSeller(true);
      } else {
        setIsSeller(false);
      }
    } catch (error) {
      console.error(error.message);
      setIsSeller(false);
    }
  };

  //fetch user auth  status, user data and cart items

  const fetchUser = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth"); // must be GET

      if (data.success) {
        setUser(data.user);
        setCartItems(data.user.cartItems);
      }
    } catch (error) {
      console.error("Error fetching user:", error.message); 
      setUser(null);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/product/list");
      if (data.success) {
        setProducts(data.products);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  //

  const addToCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] += 1;
    } else {
      cartData[itemId] = 1;
    }

    setCartItems(cartData);

    toast.success("Item added to cart");
  };

  const updateCartItem = (itemId, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId] = quantity;
    setCartItems(cartData);
    toast.success("Cart updated");
  };

  const removeFromCart = (itemId) => {
    let cartData = structuredClone(cartItems);
    if (cartData[itemId]) {
      cartData[itemId] -= 1;
      if (cartData[itemId] === 0) {
        delete cartData[itemId];
      }
    }
    toast.success("Item removed from cart");
    setCartItems(cartData);
  };

  //get cat item count
  const getCartCount = () => {
    let totalCount = 0;
    for (const item in cartItems) {
      totalCount += cartItems[item];
    }
    return totalCount;
  };

  //get cart total  amount
  const getCartAmount = () => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      const itemInfo = products.find((product) => product._id === itemId);
      if (itemInfo && cartItems[itemId] > 0) {
        totalAmount += itemInfo.offerPrice * cartItems[itemId];
      }
    }
    return Math.floor(totalAmount * 100) / 100;
  };

  useEffect(() => {
    fetchUser();
    fetchSeller();
    fetchProducts();
  }, []);
  //update database cart items on change
  useEffect(() => {
    const updatedCart = async () => {
      try {
        const { data } = await axios.post("/api/cart/update", {
          userId: user?._id,    // ✅ send userId too
          cartItems,
        });
  
        if (!data.success) {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    };
  
    if (user) {
      updatedCart();
    }
  }, [cartItems]);
  

  const value = {
    navigate,
    user,
    setUser,
    isSeller,
    setIsSeller,
    showUserLogin,
    setshowUserLogin,
    products,
    currency,
    addToCart,
    updateCartItem,
    removeFromCart,
    cartItems,
    searchQuery,
    setSearchQuery,
    getCartAmount,
    getCartCount,
    axios,
    fetchProducts,
    setCartItems
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
export const useAppContext = () => {
  return useContext(AppContext);
};
