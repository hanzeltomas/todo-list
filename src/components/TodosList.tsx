import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'
import { fetchTodos } from '@/utils'
import CreateTodoDialog from './CreateTodoDialog'
import { Todo } from '@/types'

const TodosList: React.FC = () => {
  const [todoLists, setTodoLists] = useState<Todo[]>([])
  const [dialogOpen, setDialogOpen] = useState(false)

  const { isSuccess, data, isLoading, isError } = useQuery(['todos'], () =>
    fetchTodos()
  )

  useEffect(() => {
    if (isSuccess) {
      setTodoLists(data)
    }
  }, [isSuccess, data])

  if (isSuccess) {
    return (
      <div className='flex items-center flex-col'>
        <h1 className='text-5xl font-normal leading-normal mt-0 mb-2 text-cyan-800'>
          Todos
        </h1>
        <div className='p-5 bg-[#1e293b] w-96 rounded-xl text-center relative'>
          <ul>
            {todoLists.map((todoList) => (
              <Link href={`todo/${todoList.id}`}>
                <li
                  className='text-sky-400 block w-full cursor-pointer rounded-lg p-4 transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200'
                  key={todoList.id}
                >
                  <h2>{todoList.name}</h2>
                </li>
              </Link>
            ))}
          </ul>
          <button
            onClick={() => setDialogOpen(true)}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full absolute w-fit inset-x-0 my-0 mx-auto'
          >
            + New Todo List
          </button>
          <CreateTodoDialog {...{ open: dialogOpen, setDialogOpen }} />
        </div>
      </div>
    )
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Something went wrong</div>
  }

  return <></>
}

export default TodosList
