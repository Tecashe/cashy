export function VideoShowcase() {
  return (
    <section className="py-12 lg:py-20">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Video Placeholder */}
          <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-instagram-purple/20">
            <div className="aspect-video bg-gradient-to-br from-instagram-purple/10 via-instagram-pink/10 to-instagram-orange/10 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full instagram-gradient-static flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold text-muted-foreground">[INSERT YOUR MAIN DEMO VIDEO HERE]</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Show yazzil in action - DM automation, story replies, and more
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
