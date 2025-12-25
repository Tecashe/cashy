interface VideoDemoProps {
  section: "dm" | "story" | "comment"
}

export function VideoDemo({ section }: VideoDemoProps) {
  const content = {
    dm: {
      title: "See DM Automation in Action",
      description: "Watch how yazzil handles customer conversations automatically",
    },
    story: {
      title: "Story Replies Made Simple",
      description: "See how we turn story reactions into meaningful conversations",
    },
    comment: {
      title: "Comment Automation Demo",
      description: "Watch how yazzil engages with every comment instantly",
    },
  }

  const { title, description } = content[section]

  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h3 className="text-3xl font-bold mb-3">{title}</h3>
          <p className="text-lg text-muted-foreground">{description}</p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-2 border-border">
            <div className="aspect-video bg-gradient-to-br from-secondary to-muted flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full instagram-gradient-static flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-muted-foreground">
                  [INSERT {section.toUpperCase()} DEMO VIDEO HERE]
                </p>
                <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
                  Add your Canva video showing {section} automation features
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
