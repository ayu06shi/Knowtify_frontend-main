// import React from "react"
// import copy from "copy-to-clipboard"
// import { toast } from "react-hot-toast"
// import { BsFillCaretRightFill } from "react-icons/bs"
// import { FaShareSquare } from "react-icons/fa"
// import { useDispatch, useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"

// import { addToCart } from "../../../services/operations/authAPI"
// import { ACCOUNT_TYPE } from "../../../utils/constants"


// function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
//   const { user } = useSelector((state) => state.profile)
//   const { token } = useSelector((state) => state.auth)
//   const navigate = useNavigate()
//   const dispatch = useDispatch()

//   const {
//     thumbnail: ThumbnailImage,
//     price: CurrentPrice,
//     _id: courseId,
//   } = course

//   const handleShare = () => {
//     copy(window.location.href)
//     toast.success("Link copied to clipboard")
//   }

//   const handleAddToCart = () => {
//     if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
//       toast.error("You are an Instructor. You can't buy a course.")
//       return
//     }
//     if (token && course?._id && course?.price) {
//       // Dispatching with course._id and course.price
//       dispatch(addToCart(course._id, course.price));
//       return;
//     } else {
//       toast.error("Invalid course or missing token.");
//     }
//     setConfirmationModal({
//       text1: "You are not logged in!",
//       text2: "Please login to add To Cart",
//       btn1Text: "Login",
//       btn2Text: "Cancel",
//       btn1Handler: () => navigate("/login"),
//       btn2Handler: () => setConfirmationModal(null),
//     })
//   }

//   return (
//     <>
//       <div
//         className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
//       >
//         {/* Course Image */}
//         <img
//           src={ThumbnailImage}
//           alt={course?.courseName}
//           className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
//         />

//         <div className="px-4">
//           <div className="space-x-3 pb-4 text-3xl font-semibold">
//             Rs. {CurrentPrice}
//           </div>
//           <div className="flex flex-col gap-4">
//             <button
//               className="yellowButton"
//               onClick={
//                 user && course?.studentsEnrolled.includes(user?._id)
//                   ? () => navigate("/dashboard/enrolled-courses")
//                   : handleBuyCourse
//               }
//             >
//               {user && course?.studentsEnrolled.includes(user?._id)
//                 ? "Go To Course"
//                 : "Buy Now"}
//             </button>
//             {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
//               <button onClick={handleAddToCart} className="blackButton">
//                 Add to Cart
//               </button>
//             )}
//           </div>
//           <div>
//             <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
//               30-Day Money-Back Guarantee
//             </p>
//           </div>

//           <div className={``}>
//             <p className={`my-2 text-xl font-semibold `}>
//               This Course Includes :
//             </p>
//             <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
//               {course?.instructions?.map((item, i) => {
//                 return (
//                   <p className={`flex gap-2`} key={i}>
//                     <BsFillCaretRightFill />
//                     <span>{item}</span>
//                   </p>
//                 )
//               })}
//             </div>
//           </div>
//           <div className="text-center">
//             <button
//               className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
//               onClick={handleShare}
//             >
//               <FaShareSquare size={15} /> Share
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   )
// }

// export default CourseDetailsCard
import React from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { BsFillCaretRightFill } from "react-icons/bs"
import { FaShareSquare } from "react-icons/fa"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { addToCart } from "../../../services/operations/authAPI"
import { ACCOUNT_TYPE } from "../../../utils/constants"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading: cartLoading } = useSelector((state) => state.cart)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const {
    thumbnail: ThumbnailImage,
    price: CurrentPrice,
    _id: courseId,
    courseName,
  } = course

  const handleShare = () => {
    copy(window.location.href)
    toast.success("Link copied to clipboard")
  }

  const handleAddToCart = () => {
    if (!token) {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to add to cart",
        btn1Text: "Login",
        btn2Text: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      })
      return
    }

    if (user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    if (course?.studentsEnrolled.includes(user?._id)) {
      toast.error("You are already enrolled in this course")
      return
    }

    dispatch(addToCart(course))
      .then(() => {
        toast.success(`${courseName} added to cart`)
      })
      .catch(() => {
        toast.error("Failed to add course to cart")
      })
  }

  return (
    <div className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}>
      {/* Course Image */}
      <img
        src={ThumbnailImage}
        alt={course?.courseName}
        className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
      />

      <div className="px-4">
        <div className="space-x-3 pb-4 text-3xl font-semibold">
          ₹ {CurrentPrice}
        </div>
        
        <div className="flex flex-col gap-4">
          <button
            className="yellowButton"
            onClick={
              user && course?.studentsEnrolled.includes(user?._id)
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
            disabled={cartLoading}
          >
            {user && course?.studentsEnrolled.includes(user?._id)
              ? "Go To Course"
              : "Buy Now"}
          </button>
          
          {(!user || !course?.studentsEnrolled.includes(user?._id)) && (
            <button 
              onClick={handleAddToCart} 
              className="blackButton"
              disabled={cartLoading}
            >
              {cartLoading ? "Adding..." : "Add to Cart"}
            </button>
          )}
        </div>

        <div>
          <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
            30-Day Money-Back Guarantee
          </p>
        </div>

        <div>
          <p className={`my-2 text-xl font-semibold`}>
            This Course Includes:
          </p>
          <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
            {course?.instructions?.map((item, i) => (
              <p className={`flex gap-2`} key={i}>
                <BsFillCaretRightFill />
                <span>{item}</span>
              </p>
            ))}
          </div>
        </div>
        
        <div className="text-center">
          <button
            className="mx-auto flex items-center gap-2 py-6 text-yellow-100"
            onClick={handleShare}
          >
            <FaShareSquare size={15} /> Share
          </button>
        </div>
      </div>
    </div>
  )
}

export default CourseDetailsCard