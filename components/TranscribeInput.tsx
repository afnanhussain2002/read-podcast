import React from 'react'
import { Card, CardContent, CardFooter } from './ui/card'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Button } from './ui/button'

const TranscribeInput = () => {
  return (
    <Card className="w-full">
   
    <CardContent>
      <form>
        <div className="grid grid-cols-2 w-full items-center gap-4">
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="framework">Framework</Label>
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
          <div className="flex flex-col space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Name of your project" />
          </div>
        </div>
      </form>
    </CardContent>
    <CardFooter className="flex justify-between">
      <Button variant="neutral">Deploy</Button>
    </CardFooter>
  </Card>
  )
}

export default TranscribeInput