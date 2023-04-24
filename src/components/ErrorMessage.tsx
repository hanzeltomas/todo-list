import React from 'react'

const ErrorMessage: React.FC<{ message: string }> = ({ message }) => {
  return (
    <div
      className='bg-red-100 border border-red-400 text-red-700 pl-1 rounded flex w-fit'
      role='alert'
    >
      <span className='block sm:inline'>{message}</span>
      <span className='pl-1'>
        <svg
          className='fill-current h-6 w-6 text-red-500'
          xmlns='http://www.w3.org/2000/svg'
          viewBox='0 0 20 20'
        >
          <path d='M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z' />
        </svg>
      </span>
    </div>
  )
}

export default ErrorMessage
