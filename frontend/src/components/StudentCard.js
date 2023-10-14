import React, { useState, useEffect } from 'react'
import axios from 'axios'

const StudentCard = ({
    student,
    mentor,
    setMentors,
    setStudents,
    editing,
    setEditing,
    setError,
    isSelected,
    markedStudentsCount,
    setMarkedStudentsCount }) => {

    const [scores, setScores] = useState(student.scores);
    const [totalMarks, setTotalMarks] = useState(student.totalMarks);

    const addStudent = async () => {
        setError("");

        if (student.mentorID) {
            setError("Mentor already assigned.")
            return;
        }

        if (mentor.students.length === 4) {
            setError("Cannot add more students.");
            return;
        }

        await axios.patch('http://localhost:5000/api/v1/students/updateStudent', {
            id: student._id,
            mentorID: mentor._id,
            mentorName: mentor.name
        }).then((response) => {
            setStudents(response.data);
        })

        var newStudents = mentor.students;
        await newStudents.push(student._id);
        await axios.patch('http://localhost:5000/api/v1/mentors/updateMentor', {
            id: mentor._id,
            students: newStudents
        }).then((response) => {
            setMentors(response.data);
        })
    }

    const removeStudent = async () => {
        setError("");
        if (student.isMarked === true) {
            setMarkedStudentsCount(markedStudentsCount - 1);
        }

        var newScores = scores;
        const keys = Object.keys(newScores);
        keys.forEach((key) => {
            newScores[key] = 0;
        })
        setScores(newScores);

        await axios.patch('http://localhost:5000/api/v1/students/updateStudent', {
            id: student._id,
            mentorID: "",
            mentorName: "",
            scores: newScores,
            totalMarks: 0,
            isMarked: false
        }).then((response) => {
            setStudents(response.data);
        })

        var newStudents = mentor.students
        newStudents = await newStudents.filter(function (id) {
            return id !== student._id;
        })
        await axios.patch('http://localhost:5000/api/v1/mentors/updateMentor', {
            id: mentor._id,
            students: newStudents
        }).then((response) => {
            setMentors(response.data);
        })
    }

    const saveScores = async () => {
        setEditing(0);
        if (student.isMarked === false) {
            setMarkedStudentsCount(markedStudentsCount + 1);
        }

        await axios.patch('http://localhost:5000/api/v1/students/updateStudent', {
            id: student._id,
            scores: scores,
            totalMarks: totalMarks,
            isMarked: true
        }).then((response) => {
            setStudents(response.data);
            response.data.forEach((item) => {
                if (item._id === student._id) {
                    setScores(item.scores);
                }
            })
        })
    }

    useEffect(() => {
        var totalMarks = 0;
        Object.keys(scores).forEach((key) => {
            totalMarks += scores[key];
        })
        setTotalMarks(totalMarks);
    }, [scores])

    return (
        <div className='mb-5 p-5 bg-gray-200 drop-shadow-lg rounded-md'>
            <div className='flex justify-between w-full'>
                <div className='flex w-2/3 text-3xl md:text-2xl'>
                    <div>Name:</div>
                    <div className='ml-3 font-semibold'>{student.name}</div>
                </div>

                {
                    mentor.hasSubmitted === false && <div className='flex justify-end w-1/3'>
                        {
                            (isSelected) ?
                                <div className='lg:flex lg:justify-between'>
                                    <div onClick={removeStudent} className='mx-1 px-3 py-1 text-white bg-red-500 rounded-lg border hover:cursor-pointer hover:bg-red-600'>
                                        Remove
                                    </div>

                                    <div>
                                        {
                                            (editing === student._id) ?
                                                <div onClick={saveScores} className='mt-1 lg:mt-0 mx-1 px-3 py-1 bg-green-500 rounded-lg border hover:cursor-pointer hover:bg-green-600'>
                                                    Save
                                                </div> : <div onClick={() => setEditing(student._id)} className='mt-1 lg:mt-0 mx-1 px-3 py-1 bg-gray-300 rounded-lg border hover:cursor-pointer hover:bg-gray-400'>
                                                    Edit
                                                </div>
                                        }
                                    </div>
                                </div> : <div onClick={addStudent} className='px-3 py-1 bg-green-500 rounded-lg border hover:cursor-pointer hover:bg-green-600'>
                                    Add
                                </div>
                        }
                    </div>
                }
            </div>

            <div className='flex w-2/3 text-xl md:text-lg mt-5'>
                <div>Email:</div>
                <div className='ml-3 font-semibold'>{student.email}</div>
            </div>

            <div className='flex w-2/3 text-xl md:text-lg'>
                <div>Project:</div>
                <div className='ml-3 font-semibold'>{student.project}</div>
            </div>

            {
                (mentor._id !== student.mentorID) && <div className='flex w-2/3 text-xl md:text-lg'>
                    <div>Mentor: </div>
                    <div className='ml-3 font-semibold'>{student.mentorName ? student.mentorName : "N/A"}</div>
                </div>
            }

            {
                <div className='text-xl md:text-lg'>
                    {
                        (mentor._id === student.mentorID) && <div>
                            <div>Scores: </div>
                            <ul className='ml-5'>
                                {
                                    (editing === student._id) ?
                                        Object.keys(student.scores).map((key, idx) => (
                                            <div key={idx} className='flex justify-between w-3/4'>
                                                <div>{key}: </div>
                                                <input
                                                    min={0}
                                                    max={10}
                                                    type="number"
                                                    defaultValue={student.scores[key]}
                                                    onChange={(e) => {
                                                        const newScores = { ...scores };
                                                        newScores[key] = Number(e.target.value);
                                                        setScores(newScores);
                                                    }}
                                                    className='border ml-3 px-2 mt-2'
                                                />
                                            </div>
                                        ))
                                        :
                                        Object.keys(student.scores).map((key, idx) => (
                                            <li key={idx} className='flex'>
                                                <div>
                                                    {key}:
                                                </div>
                                                <div className='ml-3 font-semibold'>
                                                    {student.scores[key]}
                                                </div>
                                            </li>
                                        ))
                                }
                            </ul>
                        </div>
                    }
                </div>
            }

            <div className='flex text-3xl md:text-2xl mt-3'>
                <div>
                    Total Marks:
                </div>
                <div className='ml-3 font-semibold'>
                    {student.totalMarks}
                </div>
            </div>
        </div>
    )
}

export default StudentCard