export interface Todo {
  id?: number
  name: string
}

export interface CreateTodoInputs {
  title: string
}

export interface CreateTodoItemInputs {
  title: string
  text: string
  deadline: Date
}

export interface TodoItem {
  id: string
  todoId: string
  title: string
  text: string
  deadline: string
  completed: boolean
}

export interface CreateTodoItemParams {
  todoId: string
  title: string
  text: string
  deadline: string
}

export interface TodoItemProps {
  todoItem: TodoItem
  formatDateTime: (datetime: Date) => string
  handleMarkAsCompleted: (todoItemId: string) => void
  handleDeleteTodoItem: (todoItemId: string) => void
}
