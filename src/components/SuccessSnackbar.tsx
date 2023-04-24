import React from 'react'
import Snackbar from '@mui/material/Snackbar'

const SuccessSnackbar: React.FC<{
  open: boolean
  snackbarDisplay: (open: boolean) => void
}> = ({ open, snackbarDisplay }) => {
  return (
    <div>
      <Snackbar
        open={open}
        onClose={() => snackbarDisplay(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        autoHideDuration={3000}
        message='Created'
      />
    </div>
  )
}

export default SuccessSnackbar
