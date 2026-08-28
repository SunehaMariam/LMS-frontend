import React, { useEffect, useState } from "react"
import "./Navbar.css"
import AddStudent from "../AddStudent/AddStudent"
import ActiveStudents from "../ActiveStudents/ActiveStudents"
import CurrentEnrolledStudents from "../CurrentEnrolledStudents/CurrentEnrolledStudents"
const Navbar = () => {

  const [showModal, setShowModal] = useState(false)
  const [students, setStudents] = useState([])
  const [editStudentData, setEditStudentData] = useState(null)


  // ===============================
  // GET STUDENTS
  // ===============================

  const getStudents = async () => {
    try {

      const response = await fetch(
        "https://lms-backend-delta-plum.vercel.app/api/students"
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch students"
        )
      }

      setStudents(data)

    } catch (error) {

      console.error("Error fetching students:", error)

    }
  }


  // Load students when page opens
  useEffect(() => {
    getStudents()
  }, [])


  // ===============================
  // ADD STUDENT
  // ===============================

  const addStudent = (student) => {

    setStudents((prevStudents) => [
      ...prevStudents,
      student
    ])

    setShowModal(false)
  }


  // ===============================
  // DELETE STUDENT
  // ===============================

  const deleteStudent = async (id) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this student?"
    )

    if (!confirmDelete) {
      return
    }

    try {

      const response = await fetch(
        `https://lms-backend-delta-plum.vercel.app/api/students/${id}`,
        {
          method: "DELETE"
        }
      )

      const data = await response.json()

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete student"
        )
      }

      // Remove student from UI
      setStudents((prevStudents) =>
        prevStudents.filter(
          (student) => student._id !== id
        )
      )

      console.log("Deleted:", data)

    } catch (error) {

      console.error("Delete error:", error)

    }
  }


  // ===============================
  // EDIT STUDENT
  // ===============================

  const editStudent = (student) => {
    setEditStudentData(student)
  }


  // ===============================
  // UPDATE STUDENT
  // ===============================

  const updateStudent = async (e) => {

    e.preventDefault()

    try {

      const response = await fetch(
        `https://lms-backend-delta-plum.vercel.app/api/students/${editStudentData._id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify(editStudentData)
        }
      )

      const updatedStudent = await response.json()

      if (!response.ok) {
        throw new Error(
          updatedStudent.message || "Failed to update student"
        )
      }

      // Update student in UI
      setStudents((prevStudents) =>
        prevStudents.map((student) =>
          student._id === updatedStudent._id
            ? updatedStudent
            : student
        )
      )

      // Close edit modal
      setEditStudentData(null)

    } catch (error) {

      console.error("Update error:", error)

    }
  }


  return (
    <>
      {/* ===============================
          NAVBAR
      =============================== */}

      <div className="main">

        <nav className="navbar">

          <ul>

            <li>Overview</li>

            <li>Courses</li>

            <li>Reviews</li>

            <button
              onClick={() => setShowModal(true)}
            >
              Add Student
            </button>

          </ul>

        </nav>

      </div>


      <ActiveStudents />
<CurrentEnrolledStudents/>

      {/* ===============================
          STUDENT LIST
      =============================== */}

      <div className="student-container">

        <h2>Students</h2>

        {students.length === 0 ? (

          <p>No students added yet.</p>

        ) : (

          <table>

            <thead>

              <tr>

                <th>Name</th>

                <th>CNIC</th>

                <th>Status</th>

                <th>Actions</th>

              </tr>

            </thead>


            <tbody>

              {students.map((student) => (

                <tr key={student._id}>

                  <td>
                    {student.name}
                  </td>

                  <td>
                    {student.cnic}
                  </td>

                  <td>

                    <span
                      className={
                        student.status === "Active"
                          ? "active"
                          : "inactive"
                      }
                    >
                      {student.status}
                    </span>

                  </td>


                  {/* ACTIONS */}

                  <td>

                    <div className="card-actions">

                      <button
                        className="edit-icon"
                        title="Edit Student"
                        onClick={() =>
                          editStudent(student)
                        }
                      >
                        ✏️
                      </button>


                      <button
                        className="delete-icon"
                        title="Delete Student"
                        onClick={() =>
                          deleteStudent(student._id)
                        }
                      >
                        🗑️
                      </button>

                    </div>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

        )}

      </div>


      {/* ===============================
          ADD STUDENT MODAL
      =============================== */}

      {showModal && (

        <AddStudent
          onClose={() => setShowModal(false)}
          onAddStudent={addStudent}
        />

      )}


      {/* ===============================
          EDIT STUDENT MODAL
      =============================== */}

      {editStudentData && (

        <div className="modal-overlay">

          <div className="modal">

            <div className="modal-header">

              <h2>Edit Student</h2>

              <button
                className="close-btn"
                onClick={() =>
                  setEditStudentData(null)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={updateStudent}>

              <label>
                Student Name
              </label>

              <input
                type="text"
                value={editStudentData.name}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    name: e.target.value
                  })
                }
                required
              />


              <label>
                CNIC
              </label>

              <input
                type="text"
                value={editStudentData.cnic}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    cnic: e.target.value
                  })
                }
                required
              />


              <label>
                Status
              </label>

              <select
                value={editStudentData.status}
                onChange={(e) =>
                  setEditStudentData({
                    ...editStudentData,
                    status: e.target.value
                  })
                }
              >

                <option value="Active">
                  Active
                </option>

                <option value="Inactive">
                  Inactive
                </option>

              </select>


              <div className="modal-buttons">

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() =>
                    setEditStudentData(null)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="save-btn"
                >
                  Update Student
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </>
  )
}

export default Navbar
