// import { useState, useEffect } from 'react'
// import axios from 'axios';
// import StudentCard from './components/StudentCard';

// function App() {
//   const [mentors, setMentors] = useState([]);
//   const [mentor, setMentor] = useState([]);
//   const [students, setStudents] = useState([]);
//   const [selectedStudents, setSelectedStudents] = useState([]);
//   const [editing, setEditing] = useState(0);
//   const [error, setError] = useState("")

//   useEffect(() => {
//     const getMentors = async () => {
//       await axios.get('http://localhost:5000/api/v1/mentors/getMentors')
//         .then((response) => {
//           setMentors(response.data);
//         })
//     }

//     const getStudents = async () => {
//       await axios.get('http://localhost:5000/api/v1/students/getStudents')
//         .then((response) => {
//           setStudents(response.data);
//           response.data.forEach((student) => {
//             if (mentor && student.mentorID && student.mentorID === mentor._id) {
//               setSelectedStudents([...selectedStudents, student]);
//             }
//           })
//         })
//     }

//     getMentors();
//     getStudents();

//   }, [])

//   useEffect(() => {
//     setMentor(mentors[0]);
//   }, [mentors])

//   return (
//     <>
//       <h1 className='flex justify-center text-3xl mt-5'>Project Evaluation Dashboard</h1>
//       <div className='flex justify-end'>
//         {
//           mentor && <div>Name: {mentor.name}</div>
//         }
//       </div>

//       {error && <div>{error}</div>}

//       <div className='flex justify-around p-5'>
//         <div className='flex flex-col items-center w-2/5 border border-black px-5'>
//           <div className='text-xl m-5'>Selected Students</div>
//           <div className='w-full'>
//             {
//               selectedStudents.map((student) => (
//                 <StudentCard
//                   key={student._id}
//                   student={student}
//                   mentor={mentor}
//                   students={students}
//                   setStudents={setStudents}
//                   selectedStudents={selectedStudents}
//                   setSelectedStudents={setSelectedStudents}
//                   isSelected={true}
//                   editing={editing}
//                   setEditing={setEditing}
//                   setError={setError}
//                   className='w-1/2' />
//               ))
//             }
//           </div>
//         </div>
//         <div className='flex flex-col items-center w-2/5 border border-black px-5'>
//           <div className='text-xl m-5'>Students</div>
//           <div className='w-full'>
//             {
//               students.map((student) => (
//                 <StudentCard
//                   key={student._id}
//                   student={student}
//                   mentor={mentor}
//                   students={students}
//                   setStudents={setStudents}
//                   selectedStudents={selectedStudents}
//                   setSelectedStudents={setSelectedStudents}
//                   isSelected={false}
//                   editing={editing}
//                   setEditing={setEditing}
//                   setError={setError}
//                   className='w-1/2' />
//               ))
//             }
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }

// export default App;

import { useState, useEffect } from 'react'
import axios from 'axios';
import StudentCard from './components/StudentCard';

function App() {
  const [mentors, setMentors] = useState([]);
  const [mentor, setMentor] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState(0);
  const [scores, setScores] = useState(null);
  const [editing, setEditing] = useState(0);
  const [error, setError] = useState("")

  useEffect(() => {
    const getMentors = async () => {
      await axios.get('http://localhost:5000/api/v1/mentors/getMentors')
        .then((response) => {
          setMentors(response.data);
          setMentor(response.data[0]);
          setSelectedStudents(response.data[0].students.length)
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

  const submit = async (id) => {
    setError("");

    if (selectedStudents < 3) {
      setError("Select atleast 3 students.");
      return;
    }

    if (mentor.hasSubmitted) {
      setError("Marks already submitted");
      return;
    }

    await axios.patch('http://localhost:5000/api/v1/mentors/updateMentor', {
      id: mentor._id,
      hasSubmitted: true
    }).then((response) => {
      setMentors(response.data);
      setSelectedStudents(response.data[0].students.length);
    })
  }

  useEffect(() => {
    setMentor(mentors[0]);
  }, [mentors]);

  return (
    <>
      <h1 className='flex justify-center text-3xl mt-5'>Project Evaluation Dashboard</h1>
      <div className='flex justify-end'>
        {
          mentor && <div>Name: {mentor.name}</div>
        }
      </div>

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
                      (student.mentorID && student.mentorID === mentor._id) ?
                        <StudentCard
                          key={student._id}
                          student={student}
                          mentor={mentor}
                          setMentors={setMentors}
                          setStudents={setStudents}
                          selectedStudents={selectedStudents}
                          scores={scores}
                          setScores={setScores}
                          setSelectedStudents={setSelectedStudents}
                          isSelected={true}
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
                    (!student.mentorID || student.mentorID !== mentor._id) ?
                      <StudentCard
                        student={student}
                        mentor={mentor}
                        setMentors={setMentors}
                        setStudents={setStudents}
                        selectedStudents={selectedStudents}
                        scores={scores}
                        setScores={setScores}
                        setSelectedStudents={setSelectedStudents}
                        isSelected={false}
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