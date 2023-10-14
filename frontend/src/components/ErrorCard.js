import React from 'react'

const ErrorCard = ({ error }) => {
    return (
        <div className='flex justify-center mx-20 py-5 text-2xl text-white bg-red-700 rounded-md'>
            {error}
        </div>
    )
}

export default ErrorCard