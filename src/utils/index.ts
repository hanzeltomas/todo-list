import axios from 'axios'
import { z } from 'zod'
import { Todo, TodoItem, CreateTodoItemParams } from '@/types'

export const fetchTodos = (): Promise<Todo[]> =>
  axios
    .get('https://6443a3b690738aa7c074a7ea.mockapi.io/todos')
    .then(({ data }) => data)

export const fetchTodo = (id: string): Promise<TodoItem[]> =>
  axios
    .get(`https://6443a3b690738aa7c074a7ea.mockapi.io/todos/${id}/todo_items`)
    .then(({ data }) => data)

export const createTodo = (todo: Todo) => {
  return axios.post('https://6443a3b690738aa7c074a7ea.mockapi.io/todos', todo)
}

export const createTodoItem = (todoItem: CreateTodoItemParams) => {
  return axios.post(
    `https://6443a3b690738aa7c074a7ea.mockapi.io/todos/${todoItem.todoId}/todo_items`,
    todoItem
  )
}

export const deleteTodoItem = ({
  todoId,
  todoItemId,
}: {
  todoId: string
  todoItemId: string
}) => {
  return axios.delete(
    `https://6443a3b690738aa7c074a7ea.mockapi.io/todos/${todoId}/todo_items/${todoItemId}`
  )
}

export const markTodoAsCompleted = ({
  todoId,
  todoItemId,
}: {
  todoId: string
  todoItemId: string
}) => {
  return axios.put(
    `https://6443a3b690738aa7c074a7ea.mockapi.io/todos/${todoId}/todo_items/${todoItemId}`,
    {
      completed: true,
    }
  )
}

export const createTodoListValidationSchema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
})

export const createTodoListItemValidationSchema = z.object({
  title: z.string().min(1, { message: 'This field is required' }),
  text: z.string().min(1, { message: 'This field is required' }),
  deadline: z
    .preprocess((arg) => {
      if (typeof arg == 'string' || arg instanceof Date) return new Date(arg)
    }, z.date())
    .refine((date) => date > new Date(Date.now()), {
      message: 'The date must be after today',
    }),
})

export const formatDateTime = (datetime: Date): string => {
  return datetime.toLocaleDateString() + ' ' + datetime.toLocaleTimeString()
}

export const searchTodoItems = (todoItems: TodoItem[], searchString: string) =>
  todoItems?.filter((todoItem) => {
    if (searchString === '') {
      return todoItem
    } else {
      return todoItem.title.includes(searchString)
    }
  })

export const filterTodoItems = (todoItems: TodoItem[], filter: string) => {
  switch (filter) {
    case 'all':
      return todoItems
    case 'active':
      return todoItems.filter(
        (todoItem) =>
          new Date(todoItem.deadline) > new Date() && !todoItem.completed
      )
    case 'completed':
      return todoItems.filter((todoItem) => todoItem.completed)
    default:
      return []
  }
}
