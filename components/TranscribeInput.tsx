import React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'

const TranscribeInput = () => {
  return (
    <Card className="w-full">
   
    <CardContent className='mt-4'>
      <form>
        <div className="flex w-full items-center gap-1">
          <div className="space-y-1.5">
            
            <Select>
              <SelectTrigger className="bg-bw text-text" id="framework">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent position="popper">
                <SelectItem value="next">Next.js</SelectItem>
                <SelectItem value="sveltekit">SvelteKit</SelectItem>
                <SelectItem value="astro">Astro</SelectItem>
                <SelectItem value="nuxt">Nuxt.js</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1 space-y-1.5">
            <Input id="name" placeholder="Name of your project" />
          </div>
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