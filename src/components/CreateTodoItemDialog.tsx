import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { DialogContent } from '@mui/material'
import { createTodoListItemValidationSchema } from '@/utils'
import { CreateTodoItemInputs } from '@/types'
import { createTodoItem } from '@/utils'
import SuccessSnackbar from './SuccessSnackbar'
import ErrorMessage from './ErrorMessage'

const CreateTodoItemDialog: React.FC<{
  open: boolean
  setDialogOpen: (open: boolean) => void
  todoListId: string
}> = ({ open, setDialogOpen, todoListId }) => {
  const [snackbar, snackbarDisplay] = React.useState(false)

  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTodoItemInputs>({
    resolver: zodResolver(createTodoListItemValidationSchema),
  })

  const mutation = useMutation({
    mutationFn: createTodoItem,
    onSuccess: () => {
      queryClient.invalidateQueries(['todo'])
      snackbarDisplay(true)
      setDialogOpen(false)
    },
  })

  const onSubmit: SubmitHandler<CreateTodoItemInputs> = (data) =>
    mutation.mutate({
      title: data.title,
      todoId: todoListId,
      text: data.text,
      deadline: data.deadline.toISOString(),
    })

  return (
    <div>
      <Dialog onClose={() => setDialogOpen(false)} open={open}>
        <DialogContent sx={{ height: '400px' }}>
          <DialogTitle> Create Todo Item </DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className='text-center'>
            <div className='text-left'>
              <label htmlFor='title'>Title</label>
              <input
                className='block mb-2 text-sm font-medium text-gray-900 border'
                placeholder='Enter todo list title here'
                id='title'
                {...register('title', { required: true })}
              />
              {errors.title && errors.title?.message && (
                <ErrorMessage message={errors.title?.message} />
              )}
              <label htmlFor='text'>Text</label>
              <textarea
                className='block mb-2 text-sm font-medium text-gray-900 border'
                placeholder='Enter todo description here'
                id='text'
                {...register('text', { required: true })}
              />
              {errors.text && errors.text?.message && (
                <ErrorMessage message={errors.text?.message} />
              )}
              <label htmlFor='deadline'>Deadline</label>
              <input
                className='block mb-2 text-sm font-medium text-gray-900 border'
                type='datetime-local'
                id='deadline'
                {...register('deadline', { required: true })}
              />
              {errors.deadline && errors.deadline?.message && (
                <ErrorMessage message={errors.deadline?.message} />
              )}
            </div>
            <input className='hover:cursor-pointer' type='submit' />
          </form>
        </DialogContent>
      </Dialog>
      <SuccessSnackbar {...{ open: snackbar, snackbarDisplay }} />
    </div>
  )
}

export default CreateTodoItemDialog
