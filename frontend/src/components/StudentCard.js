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
        <div className='mb-5'>
            <div className='flex justify-between w-full'>
                <div className='w-2/3'>Name: {student.name}</div>
                {
                    mentor.hasSubmitted === false && <div className='flex justify-end w-1/3'>
                        {
                            (isSelected) ?
                                <div className='flex justify-between w-full'>
                                    <div onClick={removeStudent} className='hover:cursor-pointer'>Remove</div>
                                    <div>
                                        {
                                            (editing === student._id) ?
                                                <div onClick={saveScores} className='hover:cursor-pointer'>
                                                    Save
                                                </div> : <div onClick={() => setEditing(student._id)} className='hover:cursor-pointer'>
                                                    Edit
                                                </div>
                                        }
                                    </div>
                                </div> : <div onClick={addStudent} className='hover:cursor-pointer'>
                                    Add
                                </div>
                        }
                    </div>
                }
            </div>

            <div>
                Email: {student.email}
            </div>
            <div>
                Project: {student.project}
            </div>

            {(mentor._id !== student.mentorID) && <div>Mentor: {student.mentorName ? student.mentorName : "N/A"}</div>}

            {<div>
                <div>Scores: </div>
                <ul>
                    {(editing === student._id) ?
                        Object.keys(student.scores).map((key, idx) => (
                            <div key={idx} className='flex'>
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
                                    }} />
                            </div>
                        ))
                        :
                        Object.keys(student.scores).map((key, idx) => (
                            <li key={idx}>{key}: {student.scores[key]}</li>
                        ))
                    }
                </ul>
            </div>
            }

            <div>Total Marks: {student.totalMarks}</div>
        </div >
    )
}

export default StudentCard