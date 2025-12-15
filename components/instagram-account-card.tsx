"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Instagram, Unlink, RefreshCw } from "lucide-react"
import { disconnectInstagramAccount, refreshInstagramToken } from "@/lib/actions/instagram-account-actions"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import { useState } from "react"

interface InstagramAccountCardProps {
  account: any
}

export function InstagramAccountCard({ account }: InstagramAccountCardProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleDisconnect = async () => {
    try {
      await disconnectInstagramAccount(account.id)
      toast({
        title: "Success",
        description: "Instagram account disconnected",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to disconnect account",
        variant: "destructive",
      })
    }
  }

  const handleRefreshToken = async () => {
    setIsRefreshing(true)
    try {
      await refreshInstagramToken(account.id)
      toast({
        title: "Success",
        description: "Token refreshed successfully",
      })
      router.refresh()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to refresh token",
        variant: "destructive",
      })
    } finally {
      setIsRefreshing(false)
    }
  }

  const isTokenExpiringSoon =
    account.tokenExpiry && new Date(account.tokenExpiry) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={account.profilePicUrl || ""} alt={account.username} />
              <AvatarFallback>
                <Instagram className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="flex items-center gap-2">
                @{account.username}
                {account.isConnected ? (
                  <Badge variant="default" className="text-xs">
                    Connected
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs">
                    Disconnected
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>{account.followerCount.toLocaleString()} followers</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Connected</p>
            <p className="font-medium">{formatDistanceToNow(new Date(account.createdAt), { addSuffix: true })}</p>
          </div>
          {account.tokenExpiry && (
            <div>
              <p className="text-muted-foreground">Token Expires</p>
              <p className={`font-medium ${isTokenExpiringSoon ? "text-destructive" : ""}`}>
                {formatDistanceToNow(new Date(account.tokenExpiry), { addSuffix: true })}
              </p>
            </div>
          )}
        </div>

        {isTokenExpiringSoon && (
          <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-3">
            <p className="text-sm text-destructive">Token expiring soon. Refresh to maintain connection.</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefreshToken}
            disabled={isRefreshing}
            className="flex-1 bg-transparent"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            {isRefreshing ? "Refreshing..." : "Refresh Token"}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="text-destructive hover:text-destructive bg-transparent">
                <Unlink className="mr-2 h-4 w-4" />
                Disconnect
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Disconnect Instagram Account</AlertDialogTitle>
                <AlertDialogDescription>
                  This will disconnect @{account.username} from your account. All automations using this account will
                  stop working. This action can be reversed by reconnecting the account.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDisconnect}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Disconnect
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  )
}
