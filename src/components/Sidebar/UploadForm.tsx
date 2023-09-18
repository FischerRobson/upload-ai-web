import { Wand2 } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Label } from '../ui/label'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from '../ui/select'
import { Slider } from '../ui/slider'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api'
import { useAtom } from 'jotai'
import { templateAtom, videoIdAtom } from '@/lib/atoms'

interface Prompt {
  id: string
  title: string
  template: string
}

export function UploadForm() {
  const [_, setTemplate] = useAtom(templateAtom)
  const [videoId] = useAtom(videoIdAtom)
  const [prompts, setPrompts] = useState<Prompt[] | null>(null)
  const [temperature, setTemperature] = useState(0.5)

  async function getPrompts() {
    const response = await api.get('/prompts')
    setPrompts(response.data)
  }

  useEffect(() => {
    getPrompts()
  }, [])

  function handlePromptSelected(promptId: string) {
    const selectedPrompt = prompts?.find((e) => e.id === promptId)

    if (!selectedPrompt) return

    setTemplate(selectedPrompt.template)
  }

  return (
    <form className="space-y-4">
      <Separator />

      <div className="space-y-2">
        <Label>Prompt</Label>
        <Select onValueChange={handlePromptSelected}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um prompt" />
          </SelectTrigger>
          <SelectContent>
            {prompts?.map((prompt) => {
              return (
                <SelectItem key={prompt.id} value={prompt.id}>
                  {prompt.title}
                </SelectItem>
              )
            })}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      <div className="space-y-2">
        <Label>Modelo</Label>
        <Select disabled defaultValue="gpt3.5">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="gpt3.5">GPT 3.5-turbo 16k</SelectItem>
          </SelectContent>
        </Select>
        <span className="block text-sm italic text-muted-foreground">
          Você poderá customizar essa opção em breve
        </span>
      </div>

      <Separator />

      <div className="space-y-4">
        <Label>Temperatura</Label>
        <Slider
          min={0}
          max={1}
          step={0.1}
          value={[temperature]}
          onValueChange={(value) => setTemperature(value[0])}
        />
        <span className="block text-xs italic leading-relaxed text-muted-foreground">
          Valores mais altos tendem a deixar o resultado mais criativo e com
          possíveis erros.
        </span>
      </div>

      <Separator />

      <Button type="submit" className="w-full">
        Executar
        <Wand2 className="ml-2 h-4 w-4" />
      </Button>
    </form>
  )
}
