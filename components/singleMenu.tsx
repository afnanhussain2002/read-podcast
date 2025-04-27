import React from 'react'

const SingleMenu = () => {
  return (
    <div className='mt-20 flex fixed'>
        <ul className='bg-brand-glow p-2 rounded-md flex gap-4 flex-col font-bold text-sm shadow-light dark:shadow-dark'>
            <a href='#fullTranscript'>Full Transcript</a>
            <a href='#chapters'>Chapters</a>
            <a href='#entities'>Entities</a>
            <a href='#summary'>Summary</a>
        </ul>
    </div>
  )
}

export default SingleMenu