import Link from 'next/link'
import React from 'react'
import { Button } from './ui/button'

type Props = {
  transcript: string
}

const TranscribedData = ({transcript}: Props) => {
  return (
   <>
   {transcript && (
      <div className="text-center mt-6">
        <p className="text-xl font-medium mb-4 text-green-600">✅ Your transcript is ready!</p>
        <Button>
        <Link
          href={`/dashboard/${transcript}`}
        >
          View Full Transcript
        </Link>
        </Button>
      </div>
    )}
   </>
  )
}

export default TranscribedData