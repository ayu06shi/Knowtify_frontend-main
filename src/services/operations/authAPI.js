import { toast } from "react-hot-toast"

import { setLoading, setToken } from "../../slices/authSlice"
import { resetCart,setCartFromBackend } from "../../slices/cartSlice"
import { setUser } from "../../slices/profileSlice"
import { apiConnector } from "../apiconnector"
import { endpoints } from "../apis"

const {
  SENDOTP_API,
  SIGNUP_API,
  LOGIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  GET_CART_API,
  ADD_TO_CART_API,
  REMOVE_FROM_CART_API,
  CLEAR_CART_API
} = endpoints

export function sendOtp(email, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      })
      console.log("SENDOTP API RESPONSE............", response)

      console.log(response.data.success)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("OTP Sent Successfully")
      navigate("/verify-email")
    } catch (error) {
      console.log("SENDOTP API ERROR............", error)
      toast.error("Could Not Send OTP")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function signUp(
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))
    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      })

      console.log("SIGNUP API RESPONSE............", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }
      toast.success("Signup Successful")
      navigate("/login")
    } catch (error) {
      console.log("SIGNUP API ERROR............", error)
      toast.error("Signup Failed")
      navigate("/signup")
    }
    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}


export function login(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("POST", LOGIN_API, { email, password })

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      const { token, user } = response.data
      toast.success("Login Successful")
      dispatch(setToken(token))

      const userImage = user?.image
        ? user.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${user.firstName} ${user.lastName}`
      dispatch(setUser({ ...user, image: userImage }))

      localStorage.setItem("token", JSON.stringify(token)) || sessionStorage.setItem("token", JSON.stringify(token))
      localStorage.setItem("user", JSON.stringify(user))

      // ✅ Fetch the cart from backend using the new separate function
      if(token){
        dispatch(getCart(token))
      }
      navigate("/dashboard/my-profile")
    } catch (error) {
      toast.error("Login Failed")
    }

    dispatch(setLoading(false))
    toast.dismiss(toastId)
  }
}

export function getCart(token) {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", GET_CART_API, null, {
        Authorization: `Bearer ${token}`,
      });


      if (response?.data) {
        const cartData = response.data;
        console.log("Response cart data: ", cartData);
        console.log("Token being sent:", token);
        


        dispatch(setCartFromBackend({
          cart: response.items,
          total: response.total,
          totalItems: response.totalItems,
        }));
        
      } else {
        console.warn("Cart data missing in response:", response?.data);
      }
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };
}




export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null))
    dispatch(setUser(null))
    //dispatch(resetCart())
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    toast.success("Logged Out")
    navigate("/")
  }
}



export function getPasswordResetToken(email , setEmailSent) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {email,})

      console.log("RESET PASSWORD TOKEN RESPONSE....", response);

      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Failed to send email for resetting password");
    }
    dispatch(setLoading(false));
  }
}

export function resetPassword(password, confirmPassword, token) {
  return async(dispatch) => {
    dispatch(setLoading(true));
    try{
      const response = await apiConnector("POST", RESETPASSWORD_API, {password, confirmPassword, token});

      console.log("RESET Password RESPONSE ... ", response);


      if(!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password has been reset successfully");
    }
    catch(error) {
      console.log("RESET PASSWORD TOKEN Error", error);
      toast.error("Unable to reset password");
    }
    dispatch(setLoading(false));
  }
}

export function addToCart(courseId, price) {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const response = await apiConnector("POST", ADD_TO_CART_API, {
        courseId,
        price,
      }, {
        Authorization: `Bearer ${token}`,
      });

      console.log("API Response:", response);

      // Check if there's an error in the response
      if (response.data.error) {
        throw new Error(response.data.error); // Throw error if there's a message in the response
      }

      const updatedCart = response.data.cart; // Extract updated cart from backend response

      dispatch(
        setCartFromBackend({
          cart: updatedCart.items || [],
          total: updatedCart.totalAmount || 0,
          totalItems: updatedCart.totalItems || 0,
        })
      );

      toast.success("Course added to cart");

    } catch (error) {
      console.log("ADD TO CART ERROR:", error);
      toast.error(error.message || "Failed to add course to cart");
    }
  };
}


export function removeFromCart(courseId) {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const response = await apiConnector("POST", REMOVE_FROM_CART_API, {
        courseId,
      }, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const updatedCart = response.data.cart;

      dispatch(
        setCartFromBackend({
          cart: updatedCart.items || [],
          total: updatedCart.total || 0,
          totalItems: updatedCart.totalItems || 0,
        })
      );

      toast.success("Course removed from cart");
    } catch (error) {
      console.log("REMOVE FROM CART ERROR:", error);
      toast.error("Failed to remove course from cart");
    }
  };
}


export function clearCart() {
  return async (dispatch, getState) => {
    try {
      const token = getState().auth.token;
      const response = await apiConnector("POST", CLEAR_CART_API, {}, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(
        setCartFromBackend({
          cart: [],
          total: 0,
          totalItems: 0,
        })
      );

      toast.success("Cart cleared successfully");
    } catch (error) {
      console.log("CLEAR CART ERROR:", error);
      toast.error("Failed to clear cart");
    }
  };
}