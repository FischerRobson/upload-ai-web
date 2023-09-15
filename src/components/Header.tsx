import { Github } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'

export function Header() {
  return (
    <div className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-xl font-bold">upload.ai</h1>

      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Desenvolvido com ❤ no nlw da Rocketseat
        </span>

        <Separator orientation="vertical" className="h-6" />

        <Button variant="outline">
          <Github className="mr-2 h-4 w-4" />
          Github
        </Button>
      </div>
    </div>
  )
}
