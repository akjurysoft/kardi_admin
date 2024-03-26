import { CircularProgress, Typography } from '@mui/material'
import React from 'react'

const CircularProgressWithLabel = ({ value }) => {
    return (
        <div style={{ position: 'relative' }}>
            <CircularProgress variant="determinate" value={value} />
            <Typography
                variant="caption"
                style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
            >
                {`${Math.round(value)}%`}
            </Typography>
        </div>
    )
}

export default CircularProgressWithLabel