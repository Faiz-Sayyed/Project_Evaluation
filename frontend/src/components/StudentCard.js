import React from 'react'
import axios from 'axios'

const StudentCard = ({
    student,
    mentor,
    setMentors,
    setStudents,
    selectedStudents,
    setSelectedStudents,
    scores,
    setScores,
    editing,
    setEditing,
    setError,
    isSelected }) => {

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
            setSelectedStudents(response.data[0].students.length);
        })
    }

    const removeStudent = async () => {
        setError("");

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
            scores: newScores
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
            setSelectedStudents(response.data[0].students.length);
        })

    }

    const saveScores = async () => {
        setEditing(0);

        await axios.patch('http://localhost:5000/api/v1/students/updateStudent', {
            id: student._id,
            scores: scores
        }).then((response) => {
            setStudents(response.data);
        })

        var newScores = scores;
        const keys = Object.keys(newScores);
        keys.forEach((key) => {
            newScores[key] = 0;
        })
        setScores(newScores);
    }

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
                                    defaultValue={student.scores[key]}
                                    onChange={(e) => {
                                        const newScores = { ...scores };
                                        newScores[key] = e.target.value;
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
        </div >
    )
}

export default StudentCard