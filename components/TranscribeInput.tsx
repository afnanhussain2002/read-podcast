import React, { useState } from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'

const TranscribeInput = () => {
  const [inputType, setInputType] = useState('youtubeLink') 
  const [speakers, setSpeakers] = useState(false);

  return (
    <Card className="w-full">
      <CardContent className="mt-4">
        <form>
          <div className="flex w-full items-center gap-1">
            <div className="space-y-1.5 w-48">
              <Select onValueChange={(value) => setInputType(value)}>
                <SelectTrigger className="bg-bw text-text" id="framework">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="youtubeLink">🔗 Youtube Link</SelectItem>
                  <SelectItem value="localVideo">🎥 Local Video</SelectItem>
                  <SelectItem value="localAudio">🎧 Local Audio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 space-y-1.5">
              {inputType === 'youtubeLink' && (
                <Input id="youtubeLink" placeholder="Paste YouTube video link..." />
              )}

              {inputType === 'localVideo' && (
                <Input id="localVideo" type="file" accept="video/*" />
              )}

              {inputType === 'localAudio' && (
                <Input id="localAudio" type="file" accept="audio/*" />
              )}
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="speakers"
              checked={speakers}
              onChange={() => setSpeakers(!speakers)}
              className="w-5 h-5"
            />
            <label htmlFor="speakers" className="text-lg">Enable Speaker Detection</label>
          </div>
        </form>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button variant="default">Transcribe</Button>
      </CardFooter>
    </Card>
  )
}

export default TranscribeInput
