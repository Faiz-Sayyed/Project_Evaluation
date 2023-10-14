import React, { useState } from "react";
import axios from "axios";
import StudentCard from "./StudentCard";

const DisplayArea = ({
  mentor,
  students,
  setStudents,
  setMentors,
  setError,
  markedStudentsCount,
  setMarkedStudentsCount,
  filter,
  setLoading,
}) => {
  const [editing, setEditing] = useState(0);

  const submit = async () => {
    setError("");

    if (mentor.students.length < 3) {
      setError("Select atleast 3 students.");
      return;
    }

    if (mentor.hasSubmitted) {
      setError("Marks already submitted.");
      return;
    }

    if (mentor.students.length > markedStudentsCount) {
      setError("One or more students have not been alloted marks.");
      return;
    }

    setLoading(true);

    await axios
      .patch(`${process.env.REACT_APP_BACKEND_SERVER_URL}/api/v1/mentors/updateMentor`, {
        id: mentor._id,
        hasSubmitted: true,
      })
      .then((response) => {
        setMentors(response.data);
      });

    setLoading(false);
  };

  return (
    <div className="md:flex pb-10 justify-around pt-5 px-5 bg-gray-200">
      <div className="flex flex-col mb-20 mx-5 md:mx-10 items-center md:w-2/5 drop-shadow-lg bg-gray-300 rounded-md">
        <div className="flex justify-center w-full p-5 text-2xl text-white bg-blue-600 rounded-tl-md rounded-tr-md drop-shadow-lg">
          Selected Students
        </div>

        <div className="flex justify-end w-full">
          <div
            className="mt-2 p-1 px-5 mr-5 drop-shadow-lg bg-green-500 text-white rounded-md hover:cursor-pointer hover:bg-green-600"
            onClick={submit}
          >
            Submit
          </div>
        </div>

        {mentor && (
          <div className="w-full p-5">
            {students.map((student) => (
              <div key={student._id}>
                {student.mentorID &&
                student.mentorID === mentor._id &&
                (filter === -1 || filter === Number(student.isMarked)) ? (
                  <StudentCard
                    key={student._id}
                    student={student}
                    mentor={mentor}
                    setMentors={setMentors}
                    setStudents={setStudents}
                    isSelected={true}
                    markedStudentsCount={markedStudentsCount}
                    setMarkedStudentsCount={setMarkedStudentsCount}
                    editing={editing}
                    setEditing={setEditing}
                    setError={setError}
                    setLoading={setLoading}
                    className="w-1/2"
                  />
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col mb-20 mx-5 md:mx-10 items-center md:w-2/5 drop-shadow-lg bg-gray-300 rounded-md">
        <div className="flex justify-center w-full p-5 text-2xl text-white bg-blue-600 rounded-tl-md rounded-tr-md drop-shadow-lg">
          Students
        </div>

        {mentor && (
          <div className="w-full p-5">
            {students.map((student) => (
              <div key={student._id}>
                {(!student.mentorID || student.mentorID !== mentor._id) &&
                (filter === -1 || filter === Number(student.isMarked)) ? (
                  <StudentCard
                    student={student}
                    mentor={mentor}
                    setMentors={setMentors}
                    setStudents={setStudents}
                    isSelected={false}
                    markedStudentsCount={markedStudentsCount}
                    setMarkedStudentsCount={setMarkedStudentsCount}
                    editing={editing}
                    setEditing={setEditing}
                    setError={setError}
                    setLoading={setLoading}
                    className="w-1/2"
                  />
                ) : (
                  <></>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayArea;
