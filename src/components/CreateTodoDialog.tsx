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
            {/* include validation with required or other standard HTML validation rules */}
            <div className='text-left'>
              <label htmlFor='title'>Title</label>
              <input
                className='block mb-2 text-sm font-medium text-gray-900 border'
                placeholder='Enter todo list title here'
                id='title'
                {...register('title', { required: true })}
              />
              {/* errors will return when field validation fails  */}
              {errors.title && (
                <div
                  className='bg-red-100 border border-red-400 text-red-700 pl-1 rounded flex w-fit'
                  role='alert'
                >
                  <span className='block sm:inline'>
                    {errors.title?.message}
                  </span>
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
