import React, { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

import "video-react/dist/video-react.css"
import { useLocation } from "react-router-dom"
import { BigPlayButton, Player } from "video-react"

import { markLectureAsComplete } from "../../../services/operations/courseDetailsAPI"
import { updateCompletedLectures } from "../../../slices/viewCourseSlice"
import IconBtn from "../../common/IconBtn"
import { useForm } from "react-hook-form"
import io from "socket.io-client"

const socket = io("http://localhost:4000")

const VideoDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const playerRef = useRef(null)
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  // notes
  const [notes, setNotes] = useState("");
  const [isPublic, setIsPublic] = useState(false)
  
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [videoData, setVideoData] = useState([])
  const [previewSource, setPreviewSource] = useState("")
  const [videoEnded, setVideoEnded] = useState(false)
  const [loading, setLoading] = useState(false)

   const {
      register,
      handleSubmit,
      setValue,
      formState: { errors },
    } = useForm()


    useEffect(() => {
      setValue("notes", "")
    }, [])

    useEffect(() => {
      socket.emit("receive_note", `${courseId}-${sectionId}-${subSectionId}`);
    
      // Listen for real-time updates
      socket.on("receive_update", (content) => {
        setNotes(content);
        setValue("notes", content);
      });
    
      return () => {
        socket.off("receive_update");
      };
    }, [courseId, sectionId, subSectionId]);

      const handleNotesChange = (event) => {
        const updatedNotes = event.target.value;
        setNotes(event.target.value);

          // Emit real-time updates
          socket.emit("update_note", {
          noteId: `${courseId}-${sectionId}-${subSectionId}`,
          content: updatedNotes,
        });
      };
      
      // const handleSaveNotes = () => {
      //   // Emit the notes update event only when the Save button is clicked
      //   socket.emit("update_note", {
      //     courseId,
      //     sectionId,
      //     subSectionId,
      //     notes: notes, // Send the latest notes
      //   });
      // };
      
      const handlePublicToggle = () => {
        setIsPublic((prev) => !prev)
      }
      
      const handleCancelNotes = () => {
        setNotes("")
        setValue("notes", "")
      }
      
      const handleEditNotes = () => {
        const textarea = document.getElementById("notes")
        textarea?.focus()
      }
      
      const handleUpdateNotes = () => {
        socket.emit("update_note", {
          noteId: `${courseId}-${sectionId}-${subSectionId}`,
          content: notes,
          isPublic: isPublic,
        })
        console.log("Notes updated", { content: notes, isPublic })
      }
      
      const handleShareNotes = () => {
        const shareContent = `Here are my notes for this lecture:\n\n${notes}`
        if (navigator.share) {
          navigator.share({
            title: "Lecture Notes",
            text: shareContent,
          }).catch((err) => console.log("Share failed:", err))
        } else {
          navigator.clipboard.writeText(shareContent)
          alert("Notes copied to clipboard. You can now share them.")
        }
      }

  useEffect(() => {
    (async () => {
      if (!courseSectionData.length) return
      if (!courseId && !sectionId && !subSectionId) {
        navigate(`/dashboard/enrolled-courses`)
      } else {
        // console.log("courseSectionData", courseSectionData)
        const filteredData = courseSectionData.filter(
          (course) => course._id === sectionId
        )
        // console.log("filteredData", filteredData)
        const filteredVideoData = filteredData?.[0]?.subSection.filter(
          (data) => data._id === subSectionId
        )
        // console.log("filteredVideoData", filteredVideoData)
        setVideoData(filteredVideoData[0])
        setPreviewSource(courseEntireData.thumbnail)
        setVideoEnded(false)
      }
    })()
  }, [courseSectionData, courseEntireData, location.pathname])

  // check if the lecture is the first video of the course
  const isFirstVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSectionIndx === 0 && currentSubSectionIndx === 0) {
      return true
    } else {
      return false
    }
  }

  // go to the next video
  const goToNextVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    // console.log("no of subsections", noOfSubsections)

    if (currentSubSectionIndx !== noOfSubsections - 1) {
      const nextSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx + 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nextSubSectionId}`
      )
    } else {
      const nextSectionId = courseSectionData[currentSectionIndx + 1]._id
      const nextSubSectionId =
        courseSectionData[currentSectionIndx + 1].subSection[0]._id
      navigate(
        `/view-course/${courseId}/section/${nextSectionId}/sub-section/${nextSubSectionId}`
      )
    }
  }

  // check if the lecture is the last video of the course
  const isLastVideo = () => {
    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const noOfSubsections =
      courseSectionData[currentSectionIndx].subSection.length

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (
      currentSectionIndx === courseSectionData.length - 1 &&
      currentSubSectionIndx === noOfSubsections - 1
    ) {
      return true
    } else {
      return false
    }
  }

  // go to the previous video
  const goToPrevVideo = () => {
    // console.log(courseSectionData)

    const currentSectionIndx = courseSectionData.findIndex(
      (data) => data._id === sectionId
    )

    const currentSubSectionIndx = courseSectionData[
      currentSectionIndx
    ].subSection.findIndex((data) => data._id === subSectionId)

    if (currentSubSectionIndx !== 0) {
      const prevSubSectionId =
        courseSectionData[currentSectionIndx].subSection[
          currentSubSectionIndx - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSectionId}`
      )
    } else {
      const prevSectionId = courseSectionData[currentSectionIndx - 1]._id
      const prevSubSectionLength =
        courseSectionData[currentSectionIndx - 1].subSection.length
      const prevSubSectionId =
        courseSectionData[currentSectionIndx - 1].subSection[
          prevSubSectionLength - 1
        ]._id
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSectionId}`
      )
    }
  }

  const handleLectureCompletion = async () => {
    setLoading(true)
    const res = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    )
    if (res) {
      dispatch(updateCompletedLectures(subSectionId))
    }
    setLoading(false)
  }

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectRatio="16:9"
          playsInline
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center font-inter"
            >
              {!completedLectures.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0)
                    setVideoEnded(true)
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-10 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="blackButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-6">{videoData?.description}</p>
      <div>
  <div className="text-white text-lg font-semibold mb-2">ADD NOTES</div>

  <textarea
    id="notes"
    placeholder="Add Your Notes Here..."
    {...register("notes", { required: true })}
    value={notes}
    onChange={handleNotesChange}
    className="form-style resize-none min-h-[180px] w-full"
  />

  <div className="flex items-center gap-2 mt-3">
    <input
      type="checkbox"
      id="publicNotes"
      checked={isPublic}
      onChange={handlePublicToggle}
      className="accent-yellow-400"
    />
    <label htmlFor="publicNotes" className="text-richblack-5 text-sm">
      Make Notes Public
    </label>
  </div>

  <div className="mt-4 mb-6 flex flex-wrap w-full justify-end gap-2">
    <button
      className="flex items-center gap-2 rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900"
      onClick={handleCancelNotes}
    >
      Cancel
    </button>

    <IconBtn text="Edit" onClick={handleEditNotes} />

    <IconBtn text="Update Notes" onClick={handleUpdateNotes} />

    <IconBtn text="Share Notes" onClick={handleShareNotes} />
  </div>
</div>

    </div>
  )
}

export default VideoDetails
// video