import React from 'react'
import { TodoItemProps } from '@/types'
import DeleteIcon from '@mui/icons-material/Delete'
import CheckIcon from '@mui/icons-material/Check'

const TodoItem: React.FC<TodoItemProps> = (props) => {
  const todoItem = props.todoItem
  return (
    <div className='flex flex-row justify-between'>
      <div>
        <h2>Title: {todoItem.title}</h2>
        <p>Description: {todoItem.text}</p>
        <p>Deadline: {props.formatDateTime(new Date(todoItem.deadline))}</p>
        {todoItem.completed ? (
          <CheckIcon sx={{ color: 'green' }} />
        ) : (
          <div
            className='cursor-pointer mt-4 text-[#94a3b8] hover:scale-110 w-fit'
            onClick={() => props.handleMarkAsCompleted(todoItem.id)}
          >
            Mark as completed
          </div>
        )}
      </div>
      <div
        className='cursor-pointer mx-0 my-auto'
        onClick={() => props.handleDeleteTodoItem(todoItem.id)}
      >
        <DeleteIcon sx={{ color: 'red' }} />
      </div>
    </div>
  )
}

export default TodoItem
