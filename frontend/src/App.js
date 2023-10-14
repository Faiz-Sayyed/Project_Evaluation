import { useState, useEffect } from 'react'
import axios from 'axios';
import StudentCard from './components/StudentCard';

function App() {
  const [mentors, setMentors] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [scores, setScores] = useState(null);
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
          setScores(response.data[0].scores);
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
      if (mentor.students.includes(item._id) && item.isMarked === true) {
        count++;
      }
    })
    setMarkedStudentsCount(count);
  }, [students, mentor]);

  return (
    <>
      <h1 className='flex justify-center text-3xl mt-5'>Project Evaluation Dashboard</h1>

      <div className='flex justify-end'>
        {
          mentor && <div>Name: {mentor.name}</div>
        }
      </div>

      <form className='flex w-1/4 justify-between'>
        <div>Filter:</div>

        <div>
          <input type="radio" id="none" name="filter" onChange={(e) => setFilter(-1)} />
          <label htmlFor="none">All</label>
        </div>

        <div>
          <input type="radio" id="marked" name="filter" onChange={(e) => setFilter(1)} />
          <label htmlFor="marked">Marked</label>
        </div>

        <div>
          <input type="radio" id="notMarked" name="filter" onChange={(e) => setFilter(0)} />
          <label htmlFor="notMarked">Not Marked</label>
        </div>
      </form>

      {error && <div>{error}</div>}

      <div className='flex justify-around p-5'>
        <div className='flex flex-col items-center w-2/5 border border-black px-5'>
          <div className='text-xl m-5'>Selected Students</div>
          <div className='flex justify-end w-full' onClick={submit}>Submit</div>
          {
            mentor && <div className='w-full'>
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
                          scores={scores}
                          setScores={setScores}
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
        <div className='flex flex-col items-center w-2/5 border border-black px-5'>
          <div className='text-xl m-5'>Students</div>
          <div className='w-full'>
            {
              mentor && students.map((student) => (
                <div key={student._id}>
                  {
                    ((!student.mentorID || student.mentorID !== mentor._id) && (filter === -1 || filter == student.isMarked)) ?
                      <StudentCard
                        student={student}
                        mentor={mentor}
                        setMentors={setMentors}
                        setStudents={setStudents}
                        scores={scores}
                        setScores={setScores}
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
        </div>
      </div>
    </>
  );
}

export default App;