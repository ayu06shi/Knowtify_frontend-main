// // // import { createSlice } from "@reduxjs/toolkit"
// // // import { toast } from "react-hot-toast"

// // // const initialState = {
// // //   cart: localStorage.getItem("cart")
// // //     ? JSON.parse(localStorage.getItem("cart"))
// // //     : [],
// // //   total: localStorage.getItem("total")
// // //     ? JSON.parse(localStorage.getItem("total"))
// // //     : 0,
// // //   totalItems: localStorage.getItem("totalItems")
// // //     ? JSON.parse(localStorage.getItem("totalItems"))
// // //     : 0,
// // // }

// // // const cartSlice = createSlice({
// // //   name: "cart",
// // //   initialState,
// // //   reducers: {
// // //     addToCart: (state, action) => {
// // //       const course = action.payload
// // //       const index = state.cart.findIndex((item) => item._id === course._id)

// // //       if (index >= 0) {
// // //         // If the course is already in the cart, do not modify the quantity
// // //         toast.error("Course already in cart")
// // //         return
// // //       }
// // //       // If the course is not in the cart, add it to the cart
// // //       state.cart.push(course)
// // //       // Update the total quantity and price
// // //       state.totalItems++
// // //       state.total += course.price
// // //       // Update to localstorage
// // //       localStorage.setItem("cart", JSON.stringify(state.cart))
// // //       localStorage.setItem("total", JSON.stringify(state.total))
// // //       localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
// // //       // show toast
// // //       toast.success("Course added to cart")
// // //     },
// // //     removeFromCart: (state, action) => {
// // //       const courseId = action.payload
// // //       const index = state.cart.findIndex((item) => item._id === courseId)

// // //       if (index >= 0) {
// // //         // If the course is found in the cart, remove it
// // //         state.totalItems--
// // //         state.total -= state.cart[index].price
// // //         state.cart.splice(index, 1)
// // //         // Update to localstorage
// // //         localStorage.setItem("cart", JSON.stringify(state.cart))
// // //         localStorage.setItem("total", JSON.stringify(state.total))
// // //         localStorage.setItem("totalItems", JSON.stringify(state.totalItems))
// // //         // show toast
// // //         toast.success("Course removed from cart")
// // //       }
// // //     },
// // //     resetCart: (state) => {
// // //       state.cart = []
// // //       state.total = 0
// // //       state.totalItems = 0
// // //       // Update to localstorage
// // //       localStorage.removeItem("cart")
// // //       localStorage.removeItem("total")
// // //       localStorage.removeItem("totalItems")
// // //     },
// // //   },
// // // })

// // // export const { addToCart, removeFromCart, resetCart } = cartSlice.actions

// // // export default cartSlice.reducer

// // import { createSlice } from "@reduxjs/toolkit"
// // import { toast } from "react-hot-toast"


// // const initialState = {
// //   cart: [],
// //   total: 0,
// //   totalItems: 0,
// // }

// // const cartSlice = createSlice({
// //   name: "cart",
// //   initialState,
// //   reducers: {
// //     // Set cart from backend after login
// //     setCartFromBackend: (state, action) => {
// //       state.cart = action.payload.cart
// //       state.total = action.payload.total
// //       state.totalItems = action.payload.totalItems
// //     },
// // //yha se change kiye h
// //     /*addToCart: (state, action) => {
// //       const course = action.payload

// //       //add
// //       /*console.log("Adding course:", course); // Debug log
// //       if (!course?._id) {
// //         console.error("Course has no _id:", course);
// //         return;
// //       }*/
// //       /*const exists = state.cart.find((item) => item._id === course._id)

// //       if (exists) {
// //         toast.error("Course already in cart")
// //         return
// //       }

// //       // Optimistically update local state (you should call backend separately)
// //       state.cart.push(course)
// //       state.totalItems++
// //       state.total += course.price
// //       toast.success("Course added to cart")
// //     },*/

// //     //yha change kiye h

// //     addToCart: (state, action) => {
// //       const course = action.payload;
// //       const exists = state.cart.some((item) => String(item._id) === String(course._id));
    
// //       if (exists) {
// //         toast.error("Course already in cart");
// //         return;
// //       }
    
// //       state.cart.push(course);
// //       state.totalItems++;
// //       state.total += course.price;
// //       toast.success("Course added to cart");
// //      // dispatch(addToCart(course));

// //     },
     

// //     // more duplicate

// //     /*<button
// //       disabled={cart.some((item) => item._id === course._id)}
// //       onClick={() => dispatch(addToCart(course))}
// //       >
// //     Add to Cart
// //   </button>*/

// //     removeFromCart: (state, action) => {
// //       const courseId = action.payload
// //       const index = state.cart.findIndex((item) => item._id === courseId)

// //       if (index >= 0) {
// //         state.totalItems--
// //         state.total -= state.cart[index].price
// //         state.cart.splice(index, 1)
// //         toast.success("Course removed from cart")
// //       }
// //     },

// //     // resetCart: (state) => {
// //     //   state.cart = []
// //     //   state.total = 0
// //     //   state.totalItems = 0
// //     // },
// //   },
// // })

// // // I have add LocalStorage here to persistant cart across refresh
// // const loadState = (key, defaultValue) => {
// //   try {
// //     const stored = localStorage.getItem(key);
// //     return stored ? JSON.parse(stored) : defaultValue;
// //   } catch {
// //     return defaultValue;
// //   }
// // };

// // const saveCartState = (cart, total, totalItems) => {
// //   localStorage.setItem("cart", JSON.stringify(cart));
// //   localStorage.setItem("total", JSON.stringify(total));
// //   localStorage.setItem("totalItems", JSON.stringify(totalItems));
// // };

// // export const {
// //   addToCart,
// //   removeFromCart,
// //   //resetCart,
// //   setCartFromBackend,
// // } = cartSlice.actions

// // export default cartSlice.reducer

// import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-hot-toast";

// const loadState = (key, defaultValue) => {
//   try {
//     const stored = localStorage.getItem(key);
//     return stored ? JSON.parse(stored) : defaultValue;
//   } catch {
//     return defaultValue;
//   }
// };

// const saveCartState = (items, total, totalItems) => {
//   localStorage.setItem("items", JSON.stringify(items));
//   localStorage.setItem("total", JSON.stringify(total));
//   localStorage.setItem("totalItems", JSON.stringify(totalItems));
// };

// // Initial state uses localStorage
// const initialState = {
//   items: loadState("items", []),
//   total: loadState("total", 0),
//   totalItems: loadState("totalItems", 0),
// };

// const cartSlice = createSlice({
//   name: "items",
//   initialState,
//   reducers: {
//     // Called after login with API result
//     setCartFromBackend: (state, action) => {
//       console.log("Payload for setCartFromBackend:", action.payload);
//       console.log("Items in payload:", action.payload.cart);
//       console.log("Total amount in payload:", action.payload.total);
//       console.log("Total items in payload:", action.payload.totalItems);
    
//       // Directly assign the values from the payload to the state
//       state.items = action.payload.cart || []; // Cart items
//       state.total = action.payload.total || 0; // Total amount of the cart
//       state.totalItems = action.payload.totalItems || 0; // Total number of items in the cart
    
//       console.log("Updated cart state:", JSON.parse(JSON.stringify(state)));
    
//       // Save to localStorage
//       saveCartState(state.items, state.total, state.totalItems);
//     },
    

//     addToCart: (state, action) => {
//       const course = action.payload;
//       const exists = state.items.some((item) => String(item._id) === String(course._id));
//       if (exists) {
//         toast.error("Course already in cart");
//         return;
//       }
//       state.items.push(course);
//       state.totalItems++;
//       state.total += course.price;
//       toast.success("Course added to cart");
//       saveCartState(state.items, state.total, state.totalItems); // ✅ Save to localStorage
//     },

//     removeFromCart: (state, action) => {
//       const courseId = action.payload;
//       const index = state.items.findIndex((item) => item._id === courseId);
//       if (index >= 0) {
//         state.totalItems--;
//         state.total -= state.items[index].price;
//         state.items.splice(index, 1);
//         toast.success("Course removed from cart");
//         saveCartState(state.items, state.total, state.totalItems); // ✅ Save to localStorage
//       }
//     },

//     // Optional: Reset cart manually (e.g., after successful checkout)
//     resetCart: (state) => {
//       state.items = [];
//       state.total = 0;
//       state.totalItems = 0;
//       saveCartState([], 0, 0); // ✅ Clear localStorage
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   setCartFromBackend,
//   resetCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;


// import { createSlice } from "@reduxjs/toolkit";
// import { toast } from "react-hot-toast";

// const loadState = (key, defaultValue) => {
//   try {
//     const stored = localStorage.getItem(key);
//     return stored ? JSON.parse(stored) : defaultValue;
//   } catch {
//     return defaultValue;
//   }
// };

// const saveCartState = (items, total, totalItems) => {
//   localStorage.setItem("items", JSON.stringify(items));
//   localStorage.setItem("total", JSON.stringify(total));
//   localStorage.setItem("totalItems", JSON.stringify(totalItems));
// };

// const initialState = {
//   items: loadState("items", []),
//   total: loadState("total", 0),
//   totalItems: loadState("totalItems", 0),
// };

// const cartSlice = createSlice({
//   name: "cart", // ✅ Fix: Use 'cart' instead of 'items'
//   initialState,
//   reducers: {
//     setCartFromBackend: (state, action) => {
//       console.log("Payload for setCartFromBackend:", action.payload);
//       console.log("Items in payload:", action.payload.items); // 🔄 changed from 'cart' to 'items'
//       console.log("Total amount in payload:", action.payload.total);
//       console.log("Total items in payload:", action.payload.totalItems);
    
//       state.items = action.payload.items || [];
//       state.total = action.payload.total || 0;
//       state.totalItems = action.payload.totalItems || 0;
    
//       console.log("Updated cart state:", JSON.parse(JSON.stringify(state)));
    
//       saveCartState(state.items, state.total, state.totalItems);
//     },
    

//     addToCart: (state, action) => {
//       const course = action.payload;
//       const exists = state.items.some((item) => String(item._id) === String(course._id));
//       if (exists) {
//         toast.error("Course already in cart");
//         return;
//       }
//       state.items.push(course);
//       state.totalItems++;
//       state.total += course.price;
//       toast.success("Course added to cart");
//       saveCartState(state.items, state.total, state.totalItems);
//     },

//     removeFromCart: (state, action) => {
//       const courseId = action.payload;
//       const index = state.items.findIndex((item) => item._id === courseId);
//       if (index >= 0) {
//         state.totalItems--;
//         state.total -= state.items[index].price;
//         state.items.splice(index, 1);
//         toast.success("Course removed from cart");
//         saveCartState(state.items, state.total, state.totalItems);
//       }
//     },

//     resetCart: (state) => {
//       state.items = [];
//       state.total = 0;
//       state.totalItems = 0;
//       saveCartState([], 0, 0);
//     },
//   },
// });

// export const {
//   addToCart,
//   removeFromCart,
//   setCartFromBackend,
//   resetCart,
// } = cartSlice.actions;

// export default cartSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

const initialState = {
  items: [],
  total: 0,
  totalItems: 0,
  loading: false,
  error: null,
  lastUpdated: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // For loading states
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    // For error handling
    setError: (state, action) => {
      state.error = action.payload;
    },

    // Set complete cart state (after API calls)
    setCart: (state, action) => {
      state.items = action.payload.items || [];
      state.total = action.payload.total || 0;
      state.totalItems = action.payload.totalItems || 0;
      state.error = null;
      state.lastUpdated = Date.now();
    },

    // Optimistic update when adding item
    addItemOptimistic: (state, action) => {
      const course = action.payload;
      const exists = state.items.some(item => item._id === course._id);
      
      if (!exists) {
        state.items.push(course);
        state.totalItems += 1;
        state.total += course.price;
        toast.success("Adding to cart...");
      }
    },

    // Optimistic update when removing item
    removeItemOptimistic: (state, action) => {
      const courseId = action.payload;
      const index = state.items.findIndex(item => item._id === courseId);
      
      if (index >= 0) {
        const [removedItem] = state.items.splice(index, 1);
        state.totalItems -= 1;
        state.total -= removedItem.price;
        toast.success("Removing from cart...");
      }
    },

    // Reset cart completely
    resetCart: (state) => {
      state.items = [];
      state.total = 0;
      state.totalItems = 0;
      state.lastUpdated = Date.now();
    },
  },
});

export const {
  setLoading,
  setError,
  setCart,
  addItemOptimistic,
  removeItemOptimistic,
  resetCart,
} = cartSlice.actions;

// Selectors
export const selectCartItems = (state) => state.cart.items;
export const selectCartTotal = (state) => state.cart.total;
export const selectCartItemCount = (state) => state.cart.totalItems;
export const selectCartLoading = (state) => state.cart.loading;
export const selectCartError = (state) => state.cart.error;

export default cartSlice.reducer;