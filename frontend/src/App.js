import { useState, useEffect } from 'react'
import axios from 'axios';
import Header from './components/Header'
import FilterArea from './components/FilterArea'
import ErrorCard from './components/ErrorCard'
import StudentCard from './components/StudentCard';

function App() {
  const [mentors, setMentors] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [editing, setEditing] = useState(0);
  const [markedStudentsCount, setMarkedStudentsCount] = useState(0);
  const [filter, setFilter] = useState(-1);
  const [error, setError] = useState("");

  useEffect(() => {
    const getMentors = async () => {
      await axios.get('http://localhost:5000/api/v1/mentors/getMentors')
        .then((response) => {
          setMentors(response.data);
          setMentor(response.data[0]);
        })
    }

    const getStudents = async () => {
      await axios.get('http://localhost:5000/api/v1/students/getStudents')
        .then((response) => {
          setStudents(response.data);
        })
    }

    getMentors();
    getStudents();

  }, [])

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
      setError("One or more students have not been alloted marks.")
      return;
    }

    await axios.patch('http://localhost:5000/api/v1/mentors/updateMentor', {
      id: mentor._id,
      hasSubmitted: true
    }).then((response) => {
      setMentors(response.data);
    })
  }

  useEffect(() => {
    setMentor(mentors[0]);
  }, [mentors]);

  useEffect(() => {
    var count = 0;
    students.forEach((item) => {
      if (mentor && mentor.students.includes(item._id) && item.isMarked === true) {
        count++;
      }
    })
    setMarkedStudentsCount(count);
  }, [students, mentor]);

  return (
    <>
      <Header mentor={mentor} />

      <FilterArea setFilter={setFilter} />

      <div className='bg-gray-200'>
        {error && <ErrorCard error={error} />}
      </div>

      <div className='md:flex pb-10 justify-around pt-5 px-5 bg-gray-200'>
        <div className='flex flex-col mb-20 mx-5 md:mx-10 items-center md:w-2/5 drop-shadow-lg bg-gray-300 rounded-md'>
          <div className='flex justify-center w-full p-5 text-2xl text-white bg-blue-600 rounded-tl-md rounded-tr-md'>
            Selected Students
          </div>

          <div className='flex justify-end w-full'>
            <div className='mt-2 p-1 px-5 mr-5 drop-shadow-lg bg-green-500 rounded-md hover:cursor-pointer hover:bg-green-600' onClick={submit}>
              Submit
            </div>
          </div>

          {
            mentor && <div className='w-full p-5'>
              {
                students.map((student) => (
                  <div key={student._id}>
                    {
                      ((student.mentorID && student.mentorID === mentor._id) && (filter === -1 || filter == student.isMarked)) ?
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
                          className='w-1/2' /> : <></>
                    }
                  </div>
                ))
              }
            </div>
          }
        </div>

        <div className='flex flex-col mb-20 mx-5 md:mx-10 items-center md:w-2/5 drop-shadow-lg bg-gray-300 rounded-md'>
          <div className='flex justify-center w-full p-5 text-2xl text-white bg-blue-600 rounded-tl-md rounded-tr-md'>
            Students
          </div>

          {
            mentor && <div className='w-full p-5'>
              {
                students.map((student) => (
                  <div key={student._id}>
                    {
                      ((!student.mentorID || student.mentorID !== mentor._id) && (filter === -1 || filter == student.isMarked)) ?
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
                          className='w-1/2' /> : <></>
                    }
                  </div>
                ))
              }
            </div>
          }
        </div>
      </div>
    </>
  );
}

export default App;