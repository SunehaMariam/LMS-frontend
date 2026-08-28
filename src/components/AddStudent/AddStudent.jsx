import React, { useState } from "react"
import "./AddStudent.css"

const AddStudent = ({ onClose, onAddStudent }) => {

  const [student, setStudent] = useState({
    name: "",
    cnic: "",
    status: "Active"
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")


  // ===============================
  // HANDLE INPUT CHANGE
  // ===============================

  const handleChange = (e) => {

    setStudent({
      ...student,
      [e.target.name]: e.target.value
    })

  }


  // ===============================
  // ADD STUDENT
  // ===============================

  const handleSubmit = async (e) => {

    e.preventDefault()

    setLoading(true)
    setError("")

    try {

      const response = await fetch(
        "https://lms-backend-delta-plum.vercel.app/api/students",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(student)
        }
      )


      const data = await response.json()


      if (!response.ok) {

        throw new Error(
          data.message || "Failed to add student"
        )

      }


      console.log("Student added:", data)


      // Send newly added student to Navbar
      onAddStudent(data)


      // Close modal
      onClose()


    } catch (error) {

      console.error("Error:", error)

      setError(error.message)

    } finally {

      setLoading(false)

    }

  }


  return (

    <div className="modal-overlay">

      <div className="modal">


        {/* ===============================
            HEADER
        =============================== */}

        <div className="modal-header">

          <h2>Add Student</h2>

          <button
            className="close-btn"
            onClick={onClose}
            type="button"
          >
            ×
          </button>

        </div>


        {/* ===============================
            FORM
        =============================== */}

        <form onSubmit={handleSubmit}>


          {/* NAME */}

          <label>
            Student Name
          </label>

          <input
            type="text"
            name="name"
            placeholder="Enter student name"
            value={student.name}
            onChange={handleChange}
            required
          />


          {/* CNIC */}

          <label>
            CNIC
          </label>

          <input
            type="text"
            name="cnic"
            placeholder="xxxxx-xxxxxxx-x"
            value={student.cnic}
            onChange={handleChange}
            required
          />


          {/* STATUS */}

          <label>
            Status
          </label>

          <select
            name="status"
            value={student.status}
            onChange={handleChange}
          >

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

          </select>


          {/* ERROR */}

          {error && (

            <p className="error-message">
              {error}
            </p>

          )}


          {/* BUTTONS */}

          <div className="modal-buttons">


            {/* CANCEL */}

            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
              disabled={loading}
            >
              Cancel
            </button>


            {/* ADD */}

            <button
              type="submit"
              className="save-btn"
              disabled={loading}
            >

              {loading
                ? "Adding..."
                : "Add Student"
              }

            </button>


          </div>

        </form>

      </div>

    </div>

  )

}

export default AddStudent
