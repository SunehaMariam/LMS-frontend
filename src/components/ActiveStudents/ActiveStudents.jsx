
import React, { useEffect, useState } from "react"
import "./ActiveStudents.css"

const ActiveStudents = () => {

  const [count, setCount] = useState(0)
  const [loading, setLoading] = useState(true)

  const getStudents = async () => {

    try {

      const response = await fetch(
        "https://lms-backend-delta-plum.vercel.app/api/students"
      )

      const data = await response.json()

      const activeStudents = data.filter(
        (student) => student.status === "Active"
      )

      setCount(activeStudents.length)

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
    <div className="active-card">

      <div className="active-icon">
        ✓
      </div>

      <div className="active-content">

        <p>Active Students</p>

        <h2>
          {loading ? "..." : count}
        </h2>

      </div>

    </div>
  )
}

export default ActiveStudents
