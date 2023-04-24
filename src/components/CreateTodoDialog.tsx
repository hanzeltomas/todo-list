import React from 'react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import DialogTitle from '@mui/material/DialogTitle'
import Dialog from '@mui/material/Dialog'
import { DialogContent } from '@mui/material'
import { createTodoListValidationSchema } from '@/utils'
import { CreateTodoInputs } from '@/types'
import { createTodo } from '@/utils'
import SuccessSnackbar from './SuccessSnackbar'
import ErrorMessage from './ErrorMessage'

const CreateTodoDialog: React.FC<{
  open: boolean
  setDialogOpen: (open: boolean) => void
}> = ({ open, setDialogOpen }) => {
  const [snackbar, snackbarDisplay] = React.useState(false)

  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateTodoInputs>({
    resolver: zodResolver(createTodoListValidationSchema),
  })

  const mutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      queryClient.invalidateQueries(['todos'])
      snackbarDisplay(true)
      setDialogOpen(false)
    },
  })

  const onSubmit: SubmitHandler<CreateTodoInputs> = (data) =>
    mutation.mutate({ name: data.title })

  return (
    <div>
      <Dialog onClose={() => setDialogOpen(false)} open={open}>
        <DialogContent sx={{ height: '400px' }}>
          <DialogTitle> Create Todo List </DialogTitle>
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
            </div>
            <input className='hover:cursor-pointer' type='submit' />
          </form>
        </DialogContent>
      </Dialog>
      <SuccessSnackbar {...{ open: snackbar, snackbarDisplay }} />
    </div>
  )
}

export default CreateTodoDialog
