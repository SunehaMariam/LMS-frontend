
import React, { useEffect, useState } from "react"
import "./CurrentEnrolledStudents.css"

const CurrentEnrolledStudents = () => {

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const getStudents = async () => {

    try {

      const response = await fetch(
        "https://lms-backend-delta-plum.vercel.app/api/students"
      )

      const data = await response.json()

      setCount(data.length)

    } catch (error) {

      console.error("Error:", error)

    } finally {

      setLoading(false)

    }
  }


  useEffect(() => {
    getStudents()
  }, [])


  return (
    <div className="enrolled-card">

      <div className="enrolled-icon">
        👨‍🎓
      </div>

      <div className="enrolled-content">

        <p>Current Enrolled Students</p>

        <h2>
          {loading ? "..." : count}
        </h2>

      </div>

    </div>
  )
}

export default CurrentEnrolledStudents

