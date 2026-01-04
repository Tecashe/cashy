import { ContentGenerator } from "@/components/content-generator"

export default function GenerateContentPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">AI Content Generator</h1>
        <p className="text-slate-600 dark:text-slate-400">Create engaging captions and images with AI</p>
      </div>

      <ContentGenerator />
    </div>
  )
}
