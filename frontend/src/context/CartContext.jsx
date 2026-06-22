import { createContext, useContext, useReducer, useEffect } from "react";

const initialState = {
  cartItems: [],
  totalItems: 0,
  totalPrice: 0,
};

const CART_ACTIONS = {
  ADD_ITEM: "ADD_ITEM",
  REMOVE_ITEM: "REMOVE_ITEM",
  UPDATE_QTY: "UPDATE_QTY",
  CLEAR_CART: "CLEAR_CART",
  LOAD_CART: "LOAD_CART",
};

const recalculate = (items) => ({
  totalItems: items.reduce((sum, i) => sum + i.quantity, 0),
  totalPrice: items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
});

function cartReducer(state, action) {
  let updatedItems;

  switch (action.type) {

    case CART_ACTIONS.LOAD_CART:
      return { ...action.payload, ...recalculate(action.payload.cartItems) };

    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1, selectedVariant = {} } = action.payload;
      const key = `${product._id}-${JSON.stringify(selectedVariant)}`;
      const exists = state.cartItems.find((i) => i.key === key);

      updatedItems = exists
        ? state.cartItems.map((i) =>
            i.key === key ? { ...i, quantity: i.quantity + quantity } : i
          )
        : [...state.cartItems, { key, product, quantity, selectedVariant }];

      return { cartItems: updatedItems, ...recalculate(updatedItems) };
    }

    case CART_ACTIONS.REMOVE_ITEM:
      updatedItems = state.cartItems.filter((i) => i.key !== action.payload.key);
      return { cartItems: updatedItems, ...recalculate(updatedItems) };

    case CART_ACTIONS.UPDATE_QTY: {
      const { key, quantity } = action.payload;
      if (quantity < 1) {
        updatedItems = state.cartItems.filter((i) => i.key !== key);
      } else {
        updatedItems = state.cartItems.map((i) =>
          i.key === key ? { ...i, quantity } : i
        );
      }
      return { cartItems: updatedItems, ...recalculate(updatedItems) };
    }

    case CART_ACTIONS.CLEAR_CART:
      return initialState;

    default:
      return state;
  }
}

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  useEffect(() => {
    localStorage.setItem("textile_cart", JSON.stringify(state));
  }, [state]);

  useEffect(() => {
    const saved = localStorage.getItem("textile_cart");
    if (saved) {
      dispatch({ type: CART_ACTIONS.LOAD_CART, payload: JSON.parse(saved) });
    }
  }, []);

  const addToCart = (product, quantity, selectedVariant) =>
    dispatch({ type: CART_ACTIONS.ADD_ITEM, payload: { product, quantity, selectedVariant } });

  const removeFromCart = (key) =>
    dispatch({ type: CART_ACTIONS.REMOVE_ITEM, payload: { key } });

  const updateQuantity = (key, quantity) =>
    dispatch({ type: CART_ACTIONS.UPDATE_QTY, payload: { key, quantity } });

  const clearCart = () =>
    dispatch({ type: CART_ACTIONS.CLEAR_CART });

  const isInCart = (productId) =>
    state.cartItems.some((i) => i.product._id === productId);

  return (
    <CartContext.Provider
      value={{ ...state, addToCart, removeFromCart, updateQuantity, clearCart, isInCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}