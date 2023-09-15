import { VideoForm } from './VideoForm'
import { UploadForm } from './UploadForm'

export function Sidebar() {
  return (
    <aside className="w-80 space-y-6">
      <VideoForm />
      <UploadForm />
    </aside>
  )
}
