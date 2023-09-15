import { FileVideo, Upload, Wand2 } from 'lucide-react'
import { Button } from './ui/button'
import { Separator } from './ui/separator'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import {
  Select,
  SelectTrigger,
  SelectItem,
  SelectValue,
  SelectContent,
} from './ui/select'
import { Slider } from './ui/slider'

export function Sidebar() {
  return (
    <aside className="w-80 space-y-6">
      <form className="space-y-6">
        <label
          htmlFor="video"
          className="flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
        >
          <FileVideo className="h-4 w-4" />
          Selecione um video
        </label>
        <input type="file" id="video" accept="video/mp4" className="sr-only" />

        <Separator />

        <div className="space-y-2">
          <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
          <Textarea
            id="transcription_prompt"
            className="min-h-[64px] leading-relaxed"
            placeholder="Inclua palavras chave mencionadas no video separadas por virgula (,)"
          />
          <Button type="submit" className="w-full">
            Carregar Video
            <Upload className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>

      <Separator />

      <form className="space-y-6">
        <div className="space-y-2">
          <Label>Prompt</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Selecione um prompt" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="title">Titulo do YouTube</SelectItem>
              <SelectItem value="description">Descrição do YouTube</SelectItem>
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
          <Slider min={0} max={1} step={0.1} />
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
    </aside>
  )
}
