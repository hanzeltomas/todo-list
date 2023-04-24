import { useRouter } from 'next/router'
import React, { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { TodoItem } from '@/types'
import {
  fetchTodo,
  deleteTodoItem,
  markTodoAsCompleted,
  formatDateTime,
  searchTodoItems,
  filterTodoItems,
} from '@/utils'
import TextField from '@mui/material/TextField'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { ParsedUrlQuery } from 'querystring'
import Item from './TodoItem'
import CreateTodoItemDialog from './CreateTodoItemDialog'

const Todo: React.FC = () => {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { id } = router.query as ParsedUrlQuery & { id: string }

  const [todoItems, setTodos] = useState<TodoItem[]>([])
  const [searchString, setSearchString] = useState<string>('')
  const [filter, setFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)

  const { isSuccess, data, isLoading, isError } = useQuery(
    ['todo'],
    () => fetchTodo(id),
    {
      enabled: id != undefined,
    }
  )

  const filteredTodoItems = filterTodoItems(todoItems, filter)

  const deleteTodoMutation = useMutation({
    mutationFn: deleteTodoItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['todo'])
    },
  })

  const updateTodoMutation = useMutation({
    mutationFn: markTodoAsCompleted,
    onSuccess: () => {
      queryClient.invalidateQueries(['todo'])
    },
  })

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchString(e.target.value)
  }

  const handleFilter = (e: SelectChangeEvent) => {
    setFilter(e.target.value)
  }

  const handleDeleteTodoItem = (todoItemId: string) => {
    deleteTodoMutation.mutate({ todoId: id, todoItemId })
  }

  const handleMarkAsCompleted = (todoItemId: string) => {
    updateTodoMutation.mutate({ todoId: id, todoItemId })
  }

  useEffect(() => {
    if (isSuccess) {
      setTodos(data)
    }
  }, [isSuccess, data])

  if (isSuccess) {
    return (
      <div className='flex items-center flex-col'>
        <h1 className='text-5xl font-normal leading-normal mt-0 mb-2 text-cyan-800'>
          Todo Items
        </h1>
        <div className='flex items-center'>
          <TextField
            id='outlined-basic'
            onChange={handleSearchInput}
            variant='outlined'
            fullWidth
            label='Search'
            sx={{
              marginBottom: '10px',
              borderRadius: '5px',
              input: {
                '&:hover': {
                  backgroundColor: 'white',
                },
                backgroundColor: 'white !important',
              },
            }}
          />
          <FormControl variant='filled' sx={{ m: 1, minWidth: 180 }}>
            <InputLabel
              sx={{
                color: 'grey',
              }}
              id='demo-simple-select-filled-label'
            >
              Todo items
            </InputLabel>
            <Select
              labelId='demo-simple-select-filled-label'
              id='demo-simple-select-filled'
              value={filter}
              onChange={handleFilter}
              color='secondary'
              sx={{
                div: {
                  backgroundColor: 'white !important',
                  marginBottom: '10px',
                  borderRadius: '5px',
                },
              }}
            >
              <MenuItem value={'all'}>All</MenuItem>
              <MenuItem value={'active'}>Active</MenuItem>
              <MenuItem value={'completed'}>Completed</MenuItem>
            </Select>
          </FormControl>
        </div>
        <div className='p-5 bg-[#1e293b] w-4/5 rounded-xl relative'>
          <ul>
            {searchTodoItems(filteredTodoItems, searchString)?.map(
              (todoItem) => (
                <li
                  key={todoItem.id}
                  className='text-left text-sky-400 block w-full cursor-default rounded-lg p-4 transition duration-500 hover:bg-neutral-100 hover:text-neutral-500 focus:bg-neutral-100 focus:text-neutral-500 focus:ring-0 dark:hover:bg-neutral-600 dark:hover:text-neutral-200 dark:focus:bg-neutral-600 dark:focus:text-neutral-200 shadow-[inset_0_0_0_1px_#ffffff1a]'
                >
                  <Item
                    {...{
                      todoItem,
                      formatDateTime,
                      handleMarkAsCompleted,
                      handleDeleteTodoItem,
                    }}
                  />
                </li>
              )
            )}
          </ul>
          <button
            onClick={() => setDialogOpen(true)}
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full absolute w-fit inset-x-0 my-0 mx-auto'
          >
            + New Todo Item
          </button>
          <CreateTodoItemDialog
            {...{ open: dialogOpen, setDialogOpen, todoListId: id }}
          />
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

export default Todo
