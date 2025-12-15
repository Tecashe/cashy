import { redirect } from "next/navigation"

// This page redirects to the main inbox with the conversation selected
export default function ConversationPage({ params }: { params: { id: string } }) {
  redirect(`/inbox?conversation=${params.id}`)
}
