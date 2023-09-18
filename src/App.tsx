import { Textarea } from './components/ui/textarea'
import { Sidebar } from './components/Sidebar'
import { Header } from './components/Header'
import { useAtom } from 'jotai'
import { templateAtom, videoIdAtom } from './lib/atoms'
import { useCompletion } from 'ai/react'

export function App() {
  const [template] = useAtom(templateAtom)
  const [videoId] = useAtom(videoIdAtom)

  const completion = useCompletion({
    api: 'http://localhost:3333',
    body: { videoId, temperature: 0, template },
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex flex-1 gap-6 p-6">
        <Sidebar />

        <div className="flex flex-1 flex-col gap-4">
          <div className="grid flex-1 grid-rows-2 gap-4">
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Inclua um prompt para a IA..."
              value={template}
            />
            <Textarea
              className="resize-none p-4 leading-relaxed"
              placeholder="Resultado gerado pela IA"
              readOnly
            />
          </div>

          <p className="text-sm text-muted-foreground">
            Lembre-se: voce pode utilizar a variável{' '}
            <code className="text-violet-400">{'{transcription}'}</code> no seu
            prompt para adicionar o conteúdo da transcrição do video
            selecionado.
          </p>
        </div>
      </main>
    </div>
  )
}
