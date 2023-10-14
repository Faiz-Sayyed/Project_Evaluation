import React from 'react'

const Header = ({ mentor }) => {
    return (
        <>
            <h1 className='flex justify-center text-2xl sm:text-4xl py-5 bg-blue-600 text-white'>
                Project Evaluation Dashboard
            </h1>

            <div className='flex justify-end bg-blue-600 py-5 px-20 text-xl sm:text-2xl text-white'>
                {
                    mentor && <div>Name: {mentor.name}</div>
                }
            </div>
        </>
    )
}

export default Header