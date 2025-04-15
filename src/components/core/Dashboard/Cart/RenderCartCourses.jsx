// import { FaStar } from "react-icons/fa"
// import { RiDeleteBin6Line } from "react-icons/ri"
// import ReactStars from "react-rating-stars-component"
// import { useDispatch, useSelector } from "react-redux"

// import { removeFromCart } from "../../../../services/operations/authAPI"

// export default function RenderCartCourses() {
//   const { cart } = useSelector((state) => state.cart)
//   console.log("Cart from Redux:", cart);

//   const dispatch = useDispatch()
//   return (
//     <div className="flex flex-1 flex-col">
//       {cart.map((course, indx) => (
//         <div
//           key={course._id}
//           className={`flex w-full flex-wrap items-start justify-between gap-6 ${
//             indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
//           } ${indx !== 0 && "mt-6"} `}
//         >
//           <div className="flex flex-1 flex-col gap-4 xl:flex-row">
//             <img
//               src={course?.thumbnail}
//               alt={course?.courseName}
//               className="h-[148px] w-[220px] rounded-lg object-cover"
//             />
//             <div className="flex flex-col space-y-1">
//               <p className="text-lg font-medium text-richblack-5">
//                 {course?.courseName}
//               </p>
//               <p className="text-sm text-richblack-300">
//                 {course?.category?.name}
//               </p>
//               <div className="flex items-center gap-2">
//                 <span className="text-yellow-5">4.5</span>
//                 <ReactStars
//                   count={5}
//                   value={course?.ratingAndReviews?.length}
//                   size={20}
//                   edit={false}
//                   activeColor="#ffd700"
//                   emptyIcon={<FaStar />}
//                   fullIcon={<FaStar />}
//                 />
//                 <span className="text-richblack-400">
//                   {course?.ratingAndReviews?.length} Ratings
//                 </span>
//               </div>
//             </div>
//           </div>
//           <div className="flex flex-col items-end space-y-2">
//             <button
//               onClick={() => dispatch(removeFromCart(course._id))}
//               className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
//             >
//               <RiDeleteBin6Line />
//               <span>Remove</span>
//             </button>
//             <p className="mb-6 text-3xl font-medium text-yellow-100">
//               ₹ {course?.price}
//             </p>
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }

import { FaStar } from "react-icons/fa"
import { RiDeleteBin6Line } from "react-icons/ri"
import ReactStars from "react-rating-stars-component"
import { useDispatch, useSelector } from "react-redux"
import { removeFromCart } from "../../../../services/operations/authAPI"
import { getCart } from "../../../../services/operations/authAPI" // Assuming this is where getCart is imported from
import { useEffect, useState } from "react"

export default function RenderCartCourses() {
  const [cartItems, setCartItems] = useState([]);
  const items = useSelector((state) => state.cart.items) || [];
  console.log("Cart from Redux:", items);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   dispatch(getCart());
  // }, [dispatch]); // Runs once after refresh
  
  // const handleRemoveFromCart = (courseId) => {
  //   dispatch(removeFromCart(courseId))  // Assuming removeFromCart removes the item from the backend
  //   dispatch(getCart()) // Re-fetch cart after removing the course
  // }

  const fetchCart = async () => {
    try {
      const response = await getCart();
      if (response?.data) {
        setCartItems(response.data);
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleRemoveFromCart = async (courseId) => {
    try {
      await dispatch(removeFromCart(courseId));
      fetchCart(); // Refresh after delete
    } catch (error) {
      console.error("Error removing course from cart:", error);
    }
  };



  return (
    <div className="flex flex-1 flex-col">
      {items.map((course, indx) => (
        <div
          key={course._id}
          className={`flex w-full flex-wrap items-start justify-between gap-6 ${
            indx !== items.length - 1 && "border-b border-b-richblack-400 pb-6"
          } ${indx !== 0 && "mt-6"} `}
        >
          <div className="flex flex-1 flex-col gap-4 xl:flex-row">
            <img
              src={course?.thumbnail}
              alt={course?.courseName}
              className="h-[148px] w-[220px] rounded-lg object-cover"
            />
            <div className="flex flex-col space-y-1">
              <p className="text-lg font-medium text-richblack-5">
                {course?.courseName}
              </p>
              <p className="text-sm text-richblack-300">
                {course?.category?.name || "General"} {/* Ensure fallback for category */}
              </p>
              <div className="flex items-center gap-2">
                {/* Rating Calculation */}
                <span className="text-yellow-5">
                  {course?.ratingAndReviews?.length > 0 
                    ? (course.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0) / course.ratingAndReviews.length).toFixed(1)
                    : "No rating yet"}
                </span>
                <ReactStars
                  count={5}
                  value={course?.ratingAndReviews?.length > 0 
                    ? (course.ratingAndReviews.reduce((sum, review) => sum + review.rating, 0) / course.ratingAndReviews.length)
                    : 0}
                  size={20}
                  edit={false}
                  activeColor="#ffd700"
                  emptyIcon={<FaStar />}
                  fullIcon={<FaStar />}
                />
                <span className="text-richblack-400">
                  {course?.ratingAndReviews?.length} Ratings
                </span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <button
              onClick={() => handleRemoveFromCart(course._id)} // Trigger remove and re-fetch
              className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
            >
              <RiDeleteBin6Line />
              <span>Remove</span>
            </button>
            <p className="mb-6 text-3xl font-medium text-yellow-100">
              ₹ {course?.price}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
