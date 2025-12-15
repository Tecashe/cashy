"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Copy, RefreshCw, Save, ImageIcon, Hash } from "lucide-react"
import { Loader2 } from "lucide-react"

export function ContentGenerator() {
  const [topic, setTopic] = useState("")
  const [tone, setTone] = useState("professional")
  const [length, setLength] = useState("medium")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedCaptions, setGeneratedCaptions] = useState<string[]>([])
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([])
  const [imagePrompt, setImagePrompt] = useState("")
  const [imageStyle, setImageStyle] = useState("professional")
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)

  const handleGenerateCaption = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/content/generate-caption", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, length }),
      })

      if (!response.ok) throw new Error("Failed to generate caption")

      const data = await response.json()
      setGeneratedCaptions(data.captions)
    } catch (error) {
      console.error("Error generating caption:", error)
      alert("Failed to generate caption. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateHashtags = async () => {
    if (!topic.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/content/generate-hashtags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      if (!response.ok) throw new Error("Failed to generate hashtags")

      const data = await response.json()
      setGeneratedHashtags(data.hashtags)
    } catch (error) {
      console.error("Error generating hashtags:", error)
      alert("Failed to generate hashtags. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGenerateImage = async () => {
    if (!imagePrompt.trim()) return

    setIsGenerating(true)

    try {
      const response = await fetch("/api/content/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: imagePrompt, style: imageStyle }),
      })

      if (!response.ok) throw new Error("Failed to generate image")

      const data = await response.json()
      setGeneratedImage(data.imageUrl)
    } catch (error) {
      console.error("Error generating image:", error)
      alert("Failed to generate image. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    alert("Copied to clipboard!")
  }

  return (
    <Tabs defaultValue="caption" className="space-y-6">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="caption">Caption</TabsTrigger>
        <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
        <TabsTrigger value="image">Image</TabsTrigger>
      </TabsList>

      {/* Caption Generator */}
      <TabsContent value="caption" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generate Caption</CardTitle>
              <CardDescription>Create engaging captions with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic or Theme</Label>
                <Input
                  id="topic"
                  placeholder="e.g., New product launch, Behind the scenes"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tone">Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger id="tone">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                    <SelectItem value="funny">Funny</SelectItem>
                    <SelectItem value="inspirational">Inspirational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="length">Length</Label>
                <Select value={length} onValueChange={setLength}>
                  <SelectTrigger id="length">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short">Short (1-2 sentences)</SelectItem>
                    <SelectItem value="medium">Medium (3-5 sentences)</SelectItem>
                    <SelectItem value="long">Long (6+ sentences)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateCaption}
                disabled={isGenerating || !topic.trim()}
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate Caption
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generated Captions</CardTitle>
              <CardDescription>Choose the one you like best</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedCaptions.length > 0 ? (
                <div className="space-y-3">
                  {generatedCaptions.map((caption, index) => (
                    <Card key={index}>
                      <CardContent className="pt-4">
                        <p className="text-sm leading-relaxed">{caption}</p>
                        <div className="mt-3 flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => copyToClipboard(caption)}>
                            <Copy className="mr-2 h-3 w-3" />
                            Copy
                          </Button>
                          <Button variant="outline" size="sm">
                            <Save className="mr-2 h-3 w-3" />
                            Save
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Sparkles className="h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Generated captions will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Hashtag Generator */}
      <TabsContent value="hashtags" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generate Hashtags</CardTitle>
              <CardDescription>Get relevant hashtags for your content</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hashtag-topic">Content Topic</Label>
                <Textarea
                  id="hashtag-topic"
                  placeholder="Describe your post content..."
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  rows={4}
                />
              </div>

              <Button
                onClick={handleGenerateHashtags}
                disabled={isGenerating || !topic.trim()}
                className="w-full gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Hash className="h-4 w-4" />
                    Generate Hashtags
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Suggested Hashtags</CardTitle>
              <CardDescription>Mix of popular and niche hashtags</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedHashtags.length > 0 ? (
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {generatedHashtags.map((hashtag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                        onClick={() => copyToClipboard(hashtag)}
                      >
                        {hashtag}
                      </Badge>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(generatedHashtags.join(" "))}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-3 w-3" />
                    Copy All Hashtags
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Hash className="h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Generated hashtags will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Image Generator */}
      <TabsContent value="image" className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Input Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generate Image</CardTitle>
              <CardDescription>Create stunning visuals with AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="image-prompt">Image Description</Label>
                <Textarea
                  id="image-prompt"
                  placeholder="e.g., Modern minimalist product photography with purple gradient background"
                  value={imagePrompt}
                  onChange={(e) => setImagePrompt(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">Style</Label>
                <Select value={imageStyle} onValueChange={setImageStyle}>
                  <SelectTrigger id="style">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="artistic">Artistic</SelectItem>
                    <SelectItem value="minimal">Minimal</SelectItem>
                    <SelectItem value="vibrant">Vibrant</SelectItem>
                    <SelectItem value="abstract">Abstract</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                onClick={handleGenerateImage}
                disabled={isGenerating || !imagePrompt.trim()}
                className="w-full gap-2 bg-gradient-to-r from-pink-600 to-orange-600 hover:from-pink-700 hover:to-orange-700"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Image...
                  </>
                ) : (
                  <>
                    <ImageIcon className="h-4 w-4" />
                    Generate Image
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle>Generated Image</CardTitle>
              <CardDescription>Your AI-created visual</CardDescription>
            </CardHeader>
            <CardContent>
              {generatedImage ? (
                <div className="space-y-4">
                  <div className="overflow-hidden rounded-lg border">
                    <img src={generatedImage || "/placeholder.svg"} alt="Generated" className="w-full" />
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent" onClick={handleGenerateImage}>
                      <RefreshCw className="mr-2 h-3 w-3" />
                      Regenerate
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                      <Save className="mr-2 h-3 w-3" />
                      Save
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed py-16 text-center">
                  <ImageIcon className="h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">Generated image will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}
