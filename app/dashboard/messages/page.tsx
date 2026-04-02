"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { 
  MessageSquare, Send, X, Search, Phone, MoreVertical,
  Check, CheckCheck, Image as ImageIcon, Paperclip, Smile,
  ArrowLeft, Info, User, Briefcase, Star, Clock
} from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth-context"
import { useChats, useMessages, useSendMessage, markChatAsRead } from "@/lib/firebase-hooks"
import { getInitials, formatDistanceToNow } from "@/lib/utils"
import type { Chat, Message } from "@/lib/types"

function ChatListItem({ 
  chat, 
  isActive, 
  currentUserId,
  onClick 
}: { 
  chat: Chat
  isActive: boolean
  currentUserId: string
  onClick: () => void
}) {
  const otherUserId = chat.participants.find(p => p !== currentUserId) || ""
  const otherUserName = chat.participantNames?.[otherUserId] || "Utilisateur"
  const otherUserAvatar = chat.participantAvatars?.[otherUserId]
  const unread = chat.unreadCount?.[currentUserId] || 0
  const lastMessageTime = chat.lastMessageAt?.toDate 
    ? formatDistanceToNow(chat.lastMessageAt.toDate())
    : ""
  
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 transition-colors hover:bg-cream ${
        isActive ? "bg-cream border-l-4 border-orange" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="w-12 h-12">
            <AvatarImage src={otherUserAvatar} />
            <AvatarFallback className="bg-navy/10 text-navy font-bold">
              {getInitials(otherUserName)}
            </AvatarFallback>
          </Avatar>
          {/* Online indicator */}
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-success rounded-full ring-2 ring-card" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="font-semibold text-navy truncate">{otherUserName}</span>
            <span className="text-[10px] text-muted-foreground flex-shrink-0">
              {lastMessageTime}
            </span>
          </div>
          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-sm text-muted-foreground truncate">
              {chat.lastMessage || "Nouvelle conversation"}
            </p>
            {unread > 0 && (
              <Badge className="bg-orange text-white text-[10px] w-5 h-5 p-0 flex items-center justify-center rounded-full">
                {unread}
              </Badge>
            )}
          </div>
          {chat.taskTitle && (
            <Badge variant="secondary" className="mt-1.5 text-[10px]">
              <Briefcase className="w-3 h-3 mr-1" />
              {chat.taskTitle}
            </Badge>
          )}
        </div>
      </div>
    </button>
  )
}

function MessageBubble({ message, isMine }: { message: Message; isMine: boolean }) {
  const time = message.createdAt?.toDate
    ? message.createdAt.toDate().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
    : ""

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[70%] ${isMine ? "order-2" : "order-1"}`}>
        <div
          className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
            isMine
              ? "bg-navy text-white rounded-br-sm"
              : "bg-card text-foreground border border-border rounded-bl-sm shadow-sm"
          }`}
        >
          {message.text}
        </div>
        <div className={`flex items-center gap-1 mt-1 ${isMine ? "justify-end" : ""}`}>
          <span className="text-[10px] text-muted-foreground">{time}</span>
          {isMine && (
            <span className="text-success">
              {message.read ? (
                <CheckCheck className="w-3.5 h-3.5" />
              ) : (
                <Check className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  const searchParams = useSearchParams()
  const { user, userData } = useAuth()
  const { chats, loading: chatsLoading } = useChats()
  const { sendMessage } = useSendMessage()
  
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [messageText, setMessageText] = useState("")
  const [sending, setSending] = useState(false)
  const [showChatList, setShowChatList] = useState(true)
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  
  // Get chat ID for messages
  const chatId = selectedChat?.id || null
  const { messages, loading: messagesLoading } = useMessages(chatId)

  const isWorker = userData?.role === "worker"
  const currentUserId = user?.uid || ""

  // Get other user info from selected chat
  const otherUserId = selectedChat?.participants?.find(p => p !== currentUserId) || ""
  const otherUserName = selectedChat?.participantNames?.[otherUserId] || "Utilisateur"
  const otherUserAvatar = selectedChat?.participantAvatars?.[otherUserId]

  // Check URL params for starting a chat
  useEffect(() => {
    const to = searchParams.get("to")
    const toName = searchParams.get("name")
    if (to && chats.length > 0) {
      // Find existing chat with this user
      const existingChat = chats.find(c => c.participants.includes(to))
      if (existingChat) {
        setSelectedChat(existingChat)
        setShowChatList(false)
      } else {
        // Create a temporary chat object for new conversation
        setSelectedChat({
          id: `${[currentUserId, to].sort().join("_")}`,
          participants: [currentUserId, to],
          participantNames: { [currentUserId]: userData?.name || "Vous", [to]: toName || "Utilisateur" },
          participantAvatars: {},
          lastMessage: "",
          lastMessageAt: null,
          unreadCount: {},
        })
        setShowChatList(false)
      }
    }
  }, [searchParams, chats, currentUserId, userData?.name])

  // Mark chat as read when selected
  useEffect(() => {
    if (selectedChat && currentUserId) {
      markChatAsRead(selectedChat.id, currentUserId)
    }
  }, [selectedChat, currentUserId])

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Filter chats by search
  const filteredChats = chats.filter(chat => {
    if (!searchQuery) return true
    const otherName = chat.participantNames?.[chat.participants.find(p => p !== currentUserId) || ""] || ""
    return otherName.toLowerCase().includes(searchQuery.toLowerCase())
  })

  const handleSend = async () => {
    if (!messageText.trim() || !otherUserId) return
    
    setSending(true)
    try {
      await sendMessage(otherUserId, otherUserName, messageText.trim(), selectedChat?.taskId, selectedChat?.taskTitle)
      setMessageText("")
    } catch (error: unknown) {
      const message = (error as { message?: string })?.message || "Erreur"
      toast.error(`Erreur: ${message}`)
    } finally {
      setSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat)
    setShowChatList(false)
  }

  return (
    <div className="h-[calc(100vh-80px)] flex">
      {/* Chat List - Hidden on mobile when chat is selected */}
      <div className={`${showChatList ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-[340px] border-r bg-card`}>
        {/* Header */}
        <div className="p-4 border-b">
          <h1 className="font-serif text-xl font-extrabold text-navy mb-3">Messages</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher une conversation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-cream border-0"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {chatsLoading ? (
            <div className="p-4 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
              ))}
            </div>
          ) : filteredChats.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare className="w-12 h-12 mx-auto text-muted-foreground/30 mb-3" />
              <p className="text-sm text-muted-foreground">
                {searchQuery ? "Aucune conversation trouvee" : "Aucune conversation"}
              </p>
              {!isWorker && !searchQuery && (
                <Link href="/dashboard/workers">
                  <Button variant="outline" size="sm" className="mt-4">
                    Trouver des travailleurs
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="divide-y">
              {filteredChats.map(chat => (
                <ChatListItem
                  key={chat.id}
                  chat={chat}
                  isActive={selectedChat?.id === chat.id}
                  currentUserId={currentUserId}
                  onClick={() => handleSelectChat(chat)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className={`${!showChatList || !selectedChat ? "flex" : "hidden"} lg:flex flex-col flex-1 bg-cream/30`}>
        {!selectedChat ? (
          // Empty state
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8">
            <div className="w-20 h-20 bg-cream rounded-full flex items-center justify-center mb-4">
              <MessageSquare className="w-10 h-10 text-muted-foreground/30" />
            </div>
            <h2 className="font-serif text-xl font-bold text-navy mb-2">Vos messages</h2>
            <p className="text-sm text-center leading-relaxed max-w-sm">
              Selectionnez une conversation dans la liste ou commencez a discuter avec un {isWorker ? "employeur" : "travailleur"}.
            </p>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b bg-card">
              <Button 
                variant="ghost" 
                size="icon" 
                className="lg:hidden"
                onClick={() => setShowChatList(true)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              
              <Link href={`/profile/${otherUserId}`} className="flex items-center gap-3 flex-1">
                <div className="relative">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={otherUserAvatar} />
                    <AvatarFallback className="bg-navy/10 text-navy font-bold">
                      {getInitials(otherUserName)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-success rounded-full ring-2 ring-card" />
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm hover:text-orange transition-colors">
                    {otherUserName}
                  </p>
                  <p className="text-[11px] text-success">En ligne</p>
                </div>
              </Link>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href={`/profile/${otherUserId}`}>
                      <User className="w-4 h-4 mr-2" />
                      Voir le profil
                    </Link>
                  </DropdownMenuItem>
                  {selectedChat.taskId && (
                    <DropdownMenuItem asChild>
                      <Link href={`/tasks/${selectedChat.taskId}`}>
                        <Briefcase className="w-4 h-4 mr-2" />
                        Voir la tache
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-destructive">
                    Bloquer l&apos;utilisateur
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Task Context Banner */}
            {selectedChat.taskTitle && (
              <Link 
                href={`/tasks/${selectedChat.taskId}`}
                className="flex items-center gap-3 px-4 py-2 bg-orange/10 hover:bg-orange/15 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-orange" />
                <span className="text-sm text-orange font-medium truncate">
                  {selectedChat.taskTitle}
                </span>
              </Link>
            )}

            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {messagesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                      <Skeleton className={`h-12 ${i % 2 === 0 ? "w-48" : "w-64"} rounded-2xl`} />
                    </div>
                  ))}
                </div>
              ) : messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-12">
                  <div className="w-16 h-16 bg-cream rounded-full flex items-center justify-center mb-4">
                    <MessageSquare className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Commencez la conversation avec {otherUserName}
                  </p>
                </div>
              ) : (
                <>
                  {/* Date separator for first message */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground">
                      {messages[0]?.createdAt?.toDate
                        ? messages[0].createdAt.toDate().toLocaleDateString("fr-FR", {
                            weekday: "long",
                            day: "numeric",
                            month: "long"
                          })
                        : "Aujourd'hui"
                      }
                    </span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {messages.map((msg) => (
                    <MessageBubble
                      key={msg.id}
                      message={msg}
                      isMine={msg.fromId === currentUserId}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </>
              )}
            </ScrollArea>

            {/* Input */}
            <div className="p-4 border-t bg-card">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <div className="flex-1 relative">
                  <Input
                    placeholder="Ecrivez votre message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="pr-10"
                  />
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute right-1 top-1/2 -translate-y-1/2 text-muted-foreground"
                  >
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
                <Button
                  onClick={handleSend}
                  disabled={!messageText.trim() || sending}
                  className="bg-navy hover:bg-orange"
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
