import { FileVideo, Upload } from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { ChangeEvent, FormEvent, useMemo, useRef, useState } from 'react'
import { loadFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api } from '@/lib/api'
import { useAtom } from 'jotai'
import { videoIdAtom } from '@/lib/atoms'

const StatusValues = {
  WAITING: 'WAITING',
  CONVERTING: 'CONVERTING',
  UPLOADING: 'UPLOADING',
  GENERATING: 'GENERATING',
  SUCCESS: 'SUCCESS',
} as const

type Status = keyof typeof StatusValues

const StatusMessage = {
  CONVERTING: 'Convertendo...',
  GENERATING: 'Transcrevendo...',
  UPLOADING: ' Carregando...',
  SUCCESS: 'Sucesso!',
}

export function VideoForm() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [status, setStatus] = useState<Status>(StatusValues.WAITING)
  const [_, setVideoId] = useAtom(videoIdAtom)
  const promptInputRef = useRef<HTMLTextAreaElement>(null)

  function handleVideoInput(event: ChangeEvent<HTMLInputElement>) {
    const { files } = event.currentTarget

    if (!files) return

    const selectedFile = files[0]
    setVideoFile(selectedFile)
  }

  async function convertVideoToAudio(video: File) {
    console.log('Converting video...')
    const ffmpeg = await loadFFmpeg()

    await ffmpeg.writeFile('input.mp4', await fetchFile(video))

    ffmpeg.on('progress', (progress) => {
      console.log('convert progress: ' + Math.round(progress.progress * 100))
    })

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-map',
      '0:a',
      '-b:a',
      '20k',
      '-acodec',
      'libmp3lame',
      'output.mp3',
    ])

    const data = await ffmpeg.readFile('output.mp3')

    const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
    const audioFile = new File([audioFileBlob], 'audio.mp3', {
      type: 'audio/mpeg',
    })

    console.log('Convert finished')

    return audioFile
  }

  const previewURL = useMemo(() => {
    if (!videoFile) return
    return URL.createObjectURL(videoFile)
  }, [videoFile])

  async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!videoFile) return

    const prompt = promptInputRef.current?.value

    setStatus(StatusValues.CONVERTING)

    const audioFile = await convertVideoToAudio(videoFile)

    const formData = new FormData()

    formData.append('file', audioFile)

    setStatus(StatusValues.UPLOADING)

    const response = await api.post('/videos', formData)

    const videoId = response.data.id

    setStatus(StatusValues.GENERATING)

    const transcription = await api.post(`/videos/${videoId}/transcription`, {
      prompt,
    })

    setStatus(StatusValues.SUCCESS)

    setVideoId(videoId)
  }

  return (
    <form onSubmit={handleUploadVideo} className="space-y-4">
      <label
        htmlFor="video"
        className="relative flex aspect-video cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed text-sm text-muted-foreground hover:bg-primary/5"
      >
        {previewURL ? (
          <video
            src={previewURL}
            controls={false}
            className="pointer-events-none absolute inset-0"
          />
        ) : (
          <>
            <FileVideo className="h-4 w-4" />
            Selecione um video
          </>
        )}
      </label>
      <input
        type="file"
        id="video"
        accept="video/mp4"
        className="sr-only"
        onChange={handleVideoInput}
      />

      <Separator />

      <div className="space-y-2">
        <Label htmlFor="transcription_prompt">Prompt de transcrição</Label>
        <Textarea
          ref={promptInputRef}
          disabled={status !== StatusValues.WAITING}
          id="transcription_prompt"
          className="min-h-[64px] leading-relaxed"
          placeholder="Inclua palavras chave mencionadas no video separadas por virgula (,)"
        />
        <Button
          data-success={status === StatusValues.SUCCESS}
          disabled={status !== StatusValues.WAITING}
          type="submit"
          className="w-full data-[success=true]:bg-emerald-400"
        >
          {status === StatusValues.WAITING ? (
            <>
              Carregar Video
              <Upload className="ml-2 h-4 w-4" />
            </>
          ) : (
            StatusMessage[status]
          )}
        </Button>
      </div>
    </form>
  )
}
