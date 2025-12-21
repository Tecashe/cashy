// "use client"

// import { useState, useEffect } from "react"
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog"
// import { Button } from "@/components/ui/button"
// import { Label } from "@/components/ui/label"
// import { Badge } from "@/components/ui/badge"
// import { X, Plus, Sparkles } from "lucide-react"
// import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
// import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import type { TriggerConfig as TriggerConfigType } from "@/lib/types/automation"
// import { getInstagramPosts } from "@/lib/actions/instagram-media-actions"
// import { InstagramPostSelector } from "./instagram-post-selector"
// import { InstagramStorySelector } from "./instagram-story-selector"
// import { SelectedPostsPreview } from "./selected-posts-preview"
// import { motion, AnimatePresence } from "framer-motion"

// interface TriggerConfigProps {
//   open: boolean
//   onClose: () => void
//   trigger: TriggerConfigType
//   onSave: (trigger: TriggerConfigType) => void
//   accounts: any[]
// }

// export function TriggerConfig({ open, onClose, trigger, onSave, accounts }: TriggerConfigProps) {
//   const [config, setConfig] = useState(trigger.config)
//   const [keywordInput, setKeywordInput] = useState("")
//   const [posts, setPosts] = useState<any[]>([])
//   const [isLoadingPosts, setIsLoadingPosts] = useState(false)
//   const [selectedPostIds, setSelectedPostIds] = useState<string[]>(config.postIds || [])
//   const [showStorySelector, setShowStorySelector] = useState(false)
//   const [showPostSelector, setShowPostSelector] = useState(false)
//   const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>(config.storyIds || [])

//   useEffect(() => {
//     if (trigger.type === "comment" && open && accounts[0]) {
//       setIsLoadingPosts(true)
//       getInstagramPosts(accounts[0].id)
//         .then((media) => {
//           setPosts(media)
//         })
//         .catch((error) => {
//           console.error("Failed to fetch posts:", error)
//         })
//         .finally(() => {
//           setIsLoadingPosts(false)
//         })
//     }
//   }, [trigger.type, open, accounts])

//   const handleAddKeyword = () => {
//     if (keywordInput.trim()) {
//       const keywords = config.keywords || []
//       setConfig({
//         ...config,
//         keywords: [...keywords, keywordInput.trim()],
//       })
//       setKeywordInput("")
//     }
//   }

//   const handleRemoveKeyword = (index: number) => {
//     const keywords = config.keywords || []
//     setConfig({
//       ...config,
//       keywords: keywords.filter((_, i) => i !== index),
//     })
//   }

//   const handleSave = () => {
//     onSave({
//       ...trigger,
//       config: {
//         ...config,
//         postIds: selectedPostIds,
//         storyIds: selectedStoryIds,
//       },
//     })
//     onClose()
//   }

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
//         <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
//           <div className="flex items-start gap-3">
//             <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
//               <Sparkles className="h-5 w-5 text-primary" />
//             </div>
//             <div className="flex-1">
//               <DialogTitle className="text-xl font-semibold">Configure Trigger</DialogTitle>
//               <DialogDescription className="mt-1 text-sm">
//                 Set up the specific conditions for this trigger
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         <ScrollArea className="flex-1 px-6 py-6 max-h-[calc(90vh-180px)]">
//           <div className="space-y-6">
//             {/* Keyword Trigger Configuration */}
//             {trigger.type === "keyword" && (
//               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//                 <div className="space-y-3">
//                   <Label className="text-base font-semibold">Keywords</Label>
//                   <InputGroup>
//                     <InputGroupInput
//                       placeholder="Enter keyword..."
//                       value={keywordInput}
//                       onChange={(e) => setKeywordInput(e.target.value)}
//                       onKeyDown={(e) => {
//                         if (e.key === "Enter") {
//                           e.preventDefault()
//                           handleAddKeyword()
//                         }
//                       }}
//                     />
//                     <InputGroupAddon align="inline-end">
//                       <InputGroupButton onClick={handleAddKeyword} size="sm">
//                         <Plus className="h-4 w-4" />
//                         Add
//                       </InputGroupButton>
//                     </InputGroupAddon>
//                   </InputGroup>

//                   <AnimatePresence mode="popLayout">
//                     {config.keywords && config.keywords.length > 0 && (
//                       <motion.div
//                         initial={{ opacity: 0, height: 0 }}
//                         animate={{ opacity: 1, height: "auto" }}
//                         exit={{ opacity: 0, height: 0 }}
//                         className="flex flex-wrap gap-2"
//                       >
//                         {config.keywords.map((keyword: string, index: number) => (
//                           <motion.div
//                             key={index}
//                             initial={{ opacity: 0, scale: 0.8 }}
//                             animate={{ opacity: 1, scale: 1 }}
//                             exit={{ opacity: 0, scale: 0.8 }}
//                             transition={{ duration: 0.2 }}
//                           >
//                             <Badge
//                               variant="secondary"
//                               className="gap-2 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 transition-colors"
//                             >
//                               {keyword}
//                               <button
//                                 type="button"
//                                 onClick={() => handleRemoveKeyword(index)}
//                                 className="hover:text-destructive transition-colors"
//                               >
//                                 <X className="h-3 w-3" />
//                               </button>
//                             </Badge>
//                           </motion.div>
//                         ))}
//                       </motion.div>
//                     )}
//                   </AnimatePresence>
//                 </div>

//                 <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
//                   <Label className="text-base font-semibold">Match Type</Label>
//                   <RadioGroup
//                     value={config.matchType || "any"}
//                     onValueChange={(value) => setConfig({ ...config, matchType: value as "any" | "all" | "exact" })}
//                     className="space-y-3"
//                   >
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="any" id="any" />
//                       <Label htmlFor="any" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">Contains any keyword</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">
//                           Triggers when at least one keyword is found
//                         </p>
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="all" id="all" />
//                       <Label htmlFor="all" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">Contains all keywords</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">
//                           Triggers only when all keywords are found
//                         </p>
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="exact" id="exact" />
//                       <Label htmlFor="exact" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">Exact match</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">Triggers only for exact phrase match</p>
//                       </Label>
//                     </div>
//                   </RadioGroup>
//                 </div>
//               </motion.div>
//             )}

//             {/* Comment Trigger Configuration */}
//             {trigger.type === "comment" && (
//               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//                 <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
//                   <Label className="text-base font-semibold">Apply to posts</Label>
//                   <RadioGroup
//                     value={selectedPostIds.length > 0 ? "specific" : "all"}
//                     onValueChange={(value) => {
//                       if (value === "all") {
//                         setSelectedPostIds([])
//                       } else {
//                         setShowPostSelector(true)
//                       }
//                     }}
//                     className="space-y-3"
//                   >
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="all" id="all-posts" />
//                       <Label htmlFor="all-posts" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">All posts</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">
//                           Apply automation to all current and future posts
//                         </p>
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="specific" id="specific-post" />
//                       <Label htmlFor="specific-post" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">Specific posts</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">
//                           Choose which posts this automation applies to
//                         </p>
//                       </Label>
//                     </div>
//                   </RadioGroup>
//                 </div>

//                 <AnimatePresence>
//                   {selectedPostIds.length > 0 && accounts[0] && (
//                     <motion.div
//                       initial={{ opacity: 0, height: 0 }}
//                       animate={{ opacity: 1, height: "auto" }}
//                       exit={{ opacity: 0, height: 0 }}
//                     >
//                       <SelectedPostsPreview
//                         postIds={selectedPostIds}
//                         accountId={accounts[0].id}
//                         onRemove={(postId) => setSelectedPostIds(selectedPostIds.filter((id) => id !== postId))}
//                       />
//                       <Button
//                         variant="outline"
//                         size="sm"
//                         onClick={() => setShowPostSelector(true)}
//                         className="mt-3 w-full"
//                       >
//                         <Plus className="w-4 h-4 mr-2" />
//                         Add More Posts
//                       </Button>
//                     </motion.div>
//                   )}
//                 </AnimatePresence>
//               </motion.div>
//             )}

//             {trigger.type === "story_reply" && (
//               <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
//                 <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
//                   <Label className="text-base font-semibold">Apply to stories</Label>
//                   <RadioGroup
//                     value={selectedStoryIds.length > 0 ? "specific" : "all"}
//                     onValueChange={(value) => {
//                       if (value === "all") {
//                         setSelectedStoryIds([])
//                       } else {
//                         setShowStorySelector(true)
//                       }
//                     }}
//                     className="space-y-3"
//                   >
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="all" id="all-stories" />
//                       <Label htmlFor="all-stories" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">All stories</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">Apply automation to all active stories</p>
//                       </Label>
//                     </div>
//                     <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
//                       <RadioGroupItem value="specific" id="specific-story" />
//                       <Label htmlFor="specific-story" className="flex-1 cursor-pointer font-normal">
//                         <span className="font-medium">Specific stories</span>
//                         <p className="text-xs text-muted-foreground mt-0.5">
//                           Choose which stories this automation applies to
//                         </p>
//                       </Label>
//                     </div>
//                   </RadioGroup>
//                 </div>

//                 {selectedStoryIds.length > 0 && (
//                   <div className="space-y-2">
//                     <p className="text-sm font-medium">
//                       {selectedStoryIds.length} {selectedStoryIds.length === 1 ? "story" : "stories"} selected
//                     </p>
//                     <Button variant="outline" size="sm" onClick={() => setShowStorySelector(true)} className="w-full">
//                       <Plus className="w-4 h-4 mr-2" />
//                       Change Selected Stories
//                     </Button>
//                   </div>
//                 )}
//               </motion.div>
//             )}
//           </div>
//         </ScrollArea>

//         <DialogFooter className="border-t border-border/50 px-6 py-4">
//           <div className="flex w-full gap-3">
//             <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
//               Cancel
//             </Button>
//             <Button onClick={handleSave} className="flex-1 shadow-sm">
//               Save Configuration
//             </Button>
//           </div>
//         </DialogFooter>
//       </DialogContent>

//       {showPostSelector && accounts[0] && (
//         <InstagramPostSelector
//           open={showPostSelector}
//           onOpenChange={setShowPostSelector}
//           accountId={accounts[0].id}
//           selectedPostIds={selectedPostIds}
//           onSelectPosts={setSelectedPostIds}
//         />
//       )}

//       {showStorySelector && accounts[0] && (
//         <InstagramStorySelector
//           open={showStorySelector}
//           onOpenChange={setShowStorySelector}
//           accountId={accounts[0].id}
//           selectedStoryIds={selectedStoryIds}
//           onSelectStories={setSelectedStoryIds}
//         />
//       )}
//     </Dialog>
//   )
// }

"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Sparkles } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from "@/components/ui/input-group"
import { ScrollArea } from "@/components/ui/scroll-area"
import type { TriggerConfig as TriggerConfigType } from "@/lib/types/automation"
import { getInstagramPosts } from "@/lib/actions/instagram-media-actions"
import { InstagramPostSelector } from "./instagram-post-selector"
import { InstagramStorySelector } from "./instagram-story-selector"
import { SelectedPostsPreview } from "./selected-posts-preview"
import { motion, AnimatePresence } from "framer-motion"

interface TriggerConfigProps {
  open: boolean
  onClose: () => void
  trigger: TriggerConfigType
  onSave: (trigger: TriggerConfigType) => void
  accounts: any[]
}

export function TriggerConfig({ open, onClose, trigger, onSave, accounts }: TriggerConfigProps) {
  const [config, setConfig] = useState(trigger.config)
  const [keywordInput, setKeywordInput] = useState("")
  const [posts, setPosts] = useState<any[]>([])
  const [isLoadingPosts, setIsLoadingPosts] = useState(false)
  const [selectedPostIds, setSelectedPostIds] = useState<string[]>(config.postIds || [])
  const [showStorySelector, setShowStorySelector] = useState(false)
  const [showPostSelector, setShowPostSelector] = useState(false)
  const [selectedStoryIds, setSelectedStoryIds] = useState<string[]>(config.storyIds || [])

  useEffect(() => {
    if (trigger.type === "comment" && open && accounts[0]) {
      setIsLoadingPosts(true)
      getInstagramPosts(accounts[0].id)
        .then((media) => {
          setPosts(media)
        })
        .catch((error) => {
          console.error("Failed to fetch posts:", error)
        })
        .finally(() => {
          setIsLoadingPosts(false)
        })
    }
  }, [trigger.type, open, accounts])

  const handleAddKeyword = () => {
    if (keywordInput.trim()) {
      const keywords = config.keywords || []
      setConfig({
        ...config,
        keywords: [...keywords, keywordInput.trim()],
      })
      setKeywordInput("")
    }
  }

  const handleRemoveKeyword = (index: number) => {
    const keywords = config.keywords || []
    setConfig({
      ...config,
      keywords: keywords.filter((_, i) => i !== index),
    })
  }

  const handleSave = () => {
    onSave({
      ...trigger,
      config: {
        ...config,
        postIds: selectedPostIds,
        storyIds: selectedStoryIds,
      },
    })
    onClose()
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border/50">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 ring-1 ring-primary/20">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold">Configure Trigger</DialogTitle>
              <DialogDescription className="mt-1 text-sm">
                Set up the specific conditions for this trigger
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-6 max-h-[calc(90vh-180px)]">
          <div className="space-y-6">
            {/* Keyword Trigger Configuration */}
            {trigger.type === "keyword" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Keywords</Label>
                  <InputGroup>
                    <InputGroupInput
                      placeholder="Enter keyword..."
                      value={keywordInput}
                      onChange={(e) => setKeywordInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault()
                          handleAddKeyword()
                        }
                      }}
                    />
                    <InputGroupAddon align="inline-end">
                      <InputGroupButton onClick={handleAddKeyword} size="sm">
                        <Plus className="h-4 w-4" />
                        Add
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>

                  <AnimatePresence mode="popLayout">
                    {config.keywords && config.keywords.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="flex flex-wrap gap-2"
                      >
                        {config.keywords.map((keyword: string, index: number) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Badge
                              variant="secondary"
                              className="gap-2 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 transition-colors"
                            >
                              {keyword}
                              <button
                                type="button"
                                onClick={() => handleRemoveKeyword(index)}
                                className="hover:text-destructive transition-colors"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <Label className="text-base font-semibold">Match Type</Label>
                  <RadioGroup
                    value={config.matchType || "any"}
                    onValueChange={(value) => setConfig({ ...config, matchType: value as "any" | "all" | "exact" })}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="any" id="any" />
                      <Label htmlFor="any" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Contains any keyword</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Triggers when at least one keyword is found
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="all" id="all" />
                      <Label htmlFor="all" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Contains all keywords</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Triggers only when all keywords are found
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="exact" id="exact" />
                      <Label htmlFor="exact" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Exact match</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Triggers only for exact phrase match</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              </motion.div>
            )}

            {/* Comment Trigger Configuration */}
            {trigger.type === "comment" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <Label className="text-base font-semibold">Listen for</Label>
                  <RadioGroup
                    value={config.listenMode || "any"}
                    onValueChange={(value) =>
                      setConfig({
                        ...config,
                        listenMode: value as "any" | "keywords" | "first_time" | "question",
                      })
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="any" id="any-comment" />
                      <Label htmlFor="any-comment" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Any comment</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Triggers on every comment received</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="keywords" id="keywords-comment" />
                      <Label htmlFor="keywords-comment" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Specific keywords</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Only triggers when comment contains specific keywords
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="first_time" id="first-time-comment" />
                      <Label htmlFor="first-time-comment" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">First-time commenter</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Only triggers for users commenting for the first time
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="question" id="question-comment" />
                      <Label htmlFor="question-comment" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Questions only</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Triggers when comment contains a question mark
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <AnimatePresence>
                  {config.listenMode === "keywords" && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-3"
                    >
                      <Label className="text-base font-semibold">Keywords to listen for</Label>
                      <InputGroup>
                        <InputGroupInput
                          placeholder="Enter keyword..."
                          value={keywordInput}
                          onChange={(e) => setKeywordInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault()
                              handleAddKeyword()
                            }
                          }}
                        />
                        <InputGroupAddon align="inline-end">
                          <InputGroupButton onClick={handleAddKeyword} size="sm">
                            <Plus className="h-4 w-4" />
                            Add
                          </InputGroupButton>
                        </InputGroupAddon>
                      </InputGroup>

                      <AnimatePresence mode="popLayout">
                        {config.keywords && config.keywords.length > 0 && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            className="flex flex-wrap gap-2"
                          >
                            {config.keywords.map((keyword: string, index: number) => (
                              <motion.div
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                              >
                                <Badge
                                  variant="secondary"
                                  className="gap-2 px-3 py-1.5 text-sm bg-primary/10 hover:bg-primary/20 transition-colors"
                                >
                                  {keyword}
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveKeyword(index)}
                                    className="hover:text-destructive transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </Badge>
                              </motion.div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4 mt-4">
                        <Label className="text-base font-semibold">Match Type</Label>
                        <RadioGroup
                          value={config.matchType || "any"}
                          onValueChange={(value) =>
                            setConfig({ ...config, matchType: value as "any" | "all" | "exact" })
                          }
                          className="space-y-3"
                        >
                          <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                            <RadioGroupItem value="any" id="any-keyword" />
                            <Label htmlFor="any-keyword" className="flex-1 cursor-pointer font-normal">
                              <span className="font-medium">Contains any keyword</span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Triggers when at least one keyword is found
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                            <RadioGroupItem value="all" id="all-keywords" />
                            <Label htmlFor="all-keywords" className="flex-1 cursor-pointer font-normal">
                              <span className="font-medium">Contains all keywords</span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Triggers only when all keywords are found
                              </p>
                            </Label>
                          </div>
                          <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                            <RadioGroupItem value="exact" id="exact-keyword" />
                            <Label htmlFor="exact-keyword" className="flex-1 cursor-pointer font-normal">
                              <span className="font-medium">Exact match</span>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Triggers only for exact phrase match
                              </p>
                            </Label>
                          </div>
                        </RadioGroup>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <Label className="text-base font-semibold">Apply to posts</Label>
                  <RadioGroup
                    value={selectedPostIds.length > 0 ? "specific" : "all"}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedPostIds([])
                      } else {
                        setShowPostSelector(true)
                      }
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="all" id="all-posts" />
                      <Label htmlFor="all-posts" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">All posts</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Apply automation to all current and future posts
                        </p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="specific" id="specific-post" />
                      <Label htmlFor="specific-post" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Specific posts</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Choose which posts this automation applies to
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <AnimatePresence>
                  {selectedPostIds.length > 0 && accounts[0] && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <SelectedPostsPreview
                        postIds={selectedPostIds}
                        accountId={accounts[0].id}
                        onRemove={(postId) => setSelectedPostIds(selectedPostIds.filter((id) => id !== postId))}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowPostSelector(true)}
                        className="mt-3 w-full"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add More Posts
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            )}

            {trigger.type === "story_reply" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="space-y-3 rounded-lg border border-border/50 bg-muted/30 p-4">
                  <Label className="text-base font-semibold">Apply to stories</Label>
                  <RadioGroup
                    value={selectedStoryIds.length > 0 ? "specific" : "all"}
                    onValueChange={(value) => {
                      if (value === "all") {
                        setSelectedStoryIds([])
                      } else {
                        setShowStorySelector(true)
                      }
                    }}
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="all" id="all-stories" />
                      <Label htmlFor="all-stories" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">All stories</span>
                        <p className="text-xs text-muted-foreground mt-0.5">Apply automation to all active stories</p>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 rounded-md border border-border/50 bg-background p-3 transition-colors hover:bg-accent/50">
                      <RadioGroupItem value="specific" id="specific-story" />
                      <Label htmlFor="specific-story" className="flex-1 cursor-pointer font-normal">
                        <span className="font-medium">Specific stories</span>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Choose which stories this automation applies to
                        </p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                {selectedStoryIds.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-medium">
                      {selectedStoryIds.length} {selectedStoryIds.length === 1 ? "story" : "stories"} selected
                    </p>
                    <Button variant="outline" size="sm" onClick={() => setShowStorySelector(true)} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Change Selected Stories
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </ScrollArea>

        <DialogFooter className="border-t border-border/50 px-6 py-4">
          <div className="flex w-full gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button onClick={handleSave} className="flex-1 shadow-sm">
              Save Configuration
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>

      {showPostSelector && accounts[0] && (
        <InstagramPostSelector
          open={showPostSelector}
          onOpenChange={setShowPostSelector}
          accountId={accounts[0].id}
          selectedPostIds={selectedPostIds}
          onSelectPosts={setSelectedPostIds}
        />
      )}

      {showStorySelector && accounts[0] && (
        <InstagramStorySelector
          open={showStorySelector}
          onOpenChange={setShowStorySelector}
          accountId={accounts[0].id}
          selectedStoryIds={selectedStoryIds}
          onSelectStories={setSelectedStoryIds}
        />
      )}
    </Dialog>
  )
}
