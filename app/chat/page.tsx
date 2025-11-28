"use client"

import { useState, useCallback, useEffect } from 'react' // 1. Thêm useEffect
import Link from 'next/link'
// 2. Import thêm các Icon mới: Headset, PhoneCall, MessageSquare, Edit2, Check, X
import { ArrowLeft, Bot, Send, Mic, MicOff, Trash2, Lightbulb, Headset, PhoneCall, MessageSquare, Edit2, Check, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import MainNavigation from '@/components/main-navigation'
import { useChat, useVoiceSearch } from '@/hooks/use-api'
import { Textarea } from '@/components/ui/textarea'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

export default function ChatPage() {
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState('chat')
  const supportChatUrl = process.env.NEXT_PUBLIC_SUPPORT_CHAT_URL || ''
  
  // --- 3. LOGIC SỐ KHẨN CẤP (MỚI THÊM) ---
  const [sosNumber, setSosNumber] = useState('115') // Mặc định là 115
  const [isEditingSos, setIsEditingSos] = useState(false)
  const [tempNumber, setTempNumber] = useState('')

  // Khi mở trang, tự động lấy số đã lưu trong máy ra (nếu có)
  useEffect(() => {
    const saved = localStorage.getItem('emergency_contact')
    if (saved) setSosNumber(saved)
  }, [])

  // Hàm lưu số mới vào bộ nhớ máy
  const handleSaveNumber = () => {
    if (tempNumber.trim()) {
      setSosNumber(tempNumber)
      localStorage.setItem('emergency_contact', tempNumber)
      setIsEditingSos(false)
    }
  }
  // ---------------------------------------

  // State cho Ticket form
  const [ticketName, setTicketName] = useState('')
  const [ticketEmail, setTicketEmail] = useState('')
  const [ticketSubject, setTicketSubject] = useState('')
  const [ticketMessage, setTicketMessage] = useState('')
  const [ticketSubmitted, setTicketSubmitted] = useState(false)
  const [ticketLoading, setTicketLoading] = useState(false)
  const [ticketError, setTicketError] = useState<string | null>(null)
  
  const emailjsServiceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || ''
  const emailjsTemplateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || ''
  
  const { messages, loading, error, sendMessage, clearChat } = useChat()
  const { 
    isListening, 
    transcript, 
    error: voiceError, 
    startListening, 
    stopListening 
  } = useVoiceSearch()

  const handleQuickSend = useCallback(async (text: string) => {
    if (!text || loading) return
    setActiveTab('chat')
    await sendMessage(text)
  }, [loading, sendMessage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || loading) return
    const messageToSend = message.trim()
    setMessage('')
    await sendMessage(messageToSend)
  }

  const handleVoiceToggle = () => {
    if (isListening) stopListening()
    else startListening()
  }

  const quickActions = [
    { title: "Emergency Situations", actions: ["How do I perform CPR?", "What should I do for a burn?", "How to stop bleeding?", "Choking first aid"] },
    { title: "General Health", actions: ["First aid kit checklist", "Emergency contact numbers", "When to call 911", "Basic wound care"] },
    { title: "Prevention", actions: ["How to prevent accidents?", "Safety tips for home", "Emergency preparedness", "Health monitoring"] }
  ]

  const suggestions = [
    "I need help with a medical emergency", "What's in a basic first aid kit?", "How do I treat a sprained ankle?",
    "What are the signs of a heart attack?", "How to perform the Heimlich maneuver?", "First aid for allergic reactions"
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center">
            <Link href="/" className="mr-2 rounded-full p-2 hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">Back</span>
            </Link>
            <div className="flex items-center gap-2">
              <Bot className="h-6 w-6 text-red-600" />
              <h1 className="text-xl font-bold">AI Assistant</h1>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={clearChat} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" /> Clear Chat
          </Button>
        </div>
      </header>

      <main className="flex-1 flex">
        <div className="container mx-auto w-full max-w-5xl flex-1 flex flex-col px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            
            {/* 4. Sửa grid-cols-3 thành grid-cols-4 và thêm Tab Staff */}
            <TabsList className="grid w-full grid-cols-4 mt-2">
              <TabsTrigger value="chat">Chat AI</TabsTrigger>
              <TabsTrigger value="staff">Staff Support</TabsTrigger>
              <TabsTrigger value="suggestions">Quick Help</TabsTrigger>
              <TabsTrigger value="support">Ticket & FAQ</TabsTrigger>
            </TabsList>

            {/* Tab: Chat AI (Giữ nguyên) */}
            <TabsContent value="chat" className="flex-1 flex flex-col mt-2">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5 text-red-600" /> First Aid Assistant
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 py-4">
                      {messages.length === 0 && (
                        <div className="text-center py-8">
                          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                          <h3 className="text-lg font-medium mb-2">Welcome to AI First Aid Assistant</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-md mx-auto mt-4">
                            {suggestions.slice(0, 4).map((suggestion, index) => (
                              <Button key={index} variant="outline" className="text-left justify-start h-auto p-3" onClick={() => handleQuickSend(suggestion)} disabled={loading}>
                                <Lightbulb className="h-4 w-4 mr-2 flex-shrink-0" /> <span className="text-sm">{suggestion}</span>
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                      {messages.map((msg) => (
                        <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`flex gap-3 max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-red-600 text-white'}`}>
                              {msg.role === 'user' ? <span className="text-sm font-medium">U</span> : <Bot className="h-4 w-4" />}
                            </div>
                            <div className={`rounded-lg px-4 py-3 ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-muted'}`}>
                              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {loading && <div className="text-sm text-gray-500 ml-12">Typing...</div>}
                    </div>
                  </ScrollArea>
                  <div className="border-t p-4">
                    <form onSubmit={handleSubmit} className="flex gap-2">
                      <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Ask about first aid..." className="flex-1" disabled={loading} />
                      <Button type="button" variant="outline" size="icon" onClick={handleVoiceToggle} className={isListening ? 'text-red-600' : ''}>
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                      <Button type="submit" size="icon" className="bg-red-600 hover:bg-red-700" disabled={!message.trim() || loading}><Send className="h-4 w-4" /></Button>
                    </form>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* 5. Tab: Staff Support (FULL TÍNH NĂNG MỚI) */}
            <TabsContent value="staff" className="flex-1 mt-2">
              <div className="flex flex-col items-center justify-center h-full min-h-[500px] bg-white rounded-lg border shadow-sm p-6 text-center">
                <div className="mx-auto w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                  <Headset className="w-12 h-12 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold mb-4">Staff Support Center</h2>
                <p className="text-gray-600 max-w-md mb-8 text-lg">Our medical experts are available to assist you.</p>
                
                <div className="grid gap-6 w-full max-w-md">
                  {/* Nút Chat Nhân Viên */}
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 h-14 text-lg font-semibold shadow-md" onClick={() => supportChatUrl ? window.open(supportChatUrl, '_blank') : alert("Đang kết nối tới nhân viên hỗ trợ...")}>
                    <MessageSquare className="mr-3 h-6 w-6" /> Chat with Expert Now
                  </Button>
                  
                  {/* Nút Gọi SOS & Khu vực Sửa số */}
                  <div className="space-y-2">
                    <Button variant="destructive" className="w-full h-16 text-xl font-bold animate-pulse shadow-lg border-4 border-red-100" onClick={() => window.location.href = `tel:${sosNumber}`}>
                      <PhoneCall className="mr-3 h-8 w-8" /> GỌI KHẨN CẤP: {sosNumber}
                    </Button>
                    
                    <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                      {!isEditingSos ? (
                        <>
                          <span>Số hiện tại: <strong>{sosNumber}</strong></span>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => { setTempNumber(sosNumber); setIsEditingSos(true); }}>
                            <Edit2 className="h-3 w-3" />
                          </Button>
                        </>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Input value={tempNumber} onChange={(e) => setTempNumber(e.target.value)} className="h-8 w-32 text-center" autoFocus />
                          <Button variant="ghost" size="sm" className="h-8 w-8 text-green-600" onClick={handleSaveNumber}><Check className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" className="h-8 w-8 text-red-500" onClick={() => setIsEditingSos(false)}><X className="h-4 w-4" /></Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mt-8">*Giờ làm việc: 8:00 AM - 10:00 PM</p>
              </div>
            </TabsContent>

            {/* Tab: Quick Help */}
            <TabsContent value="suggestions" className="flex-1 mt-2">
              <div className="space-y-6">
                {quickActions.map((category, idx) => (
                  <Card key={idx}><CardHeader><CardTitle className="text-lg">{category.title}</CardTitle></CardHeader>
                  <CardContent><div className="grid grid-cols-1 md:grid-cols-2 gap-3">{category.actions.map((act, i) => (<Button key={i} variant="outline" className="text-left justify-start h-auto p-3" onClick={() => handleQuickSend(act)}><Lightbulb className="h-4 w-4 mr-2" /><span className="text-sm">{act}</span></Button>))}</div></CardContent></Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Tab: Ticket & FAQ */}
            <TabsContent value="support" className="flex-1 mt-2">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <Card>
                    <CardHeader><CardTitle>Send Ticket</CardTitle></CardHeader>
                    <CardContent>
                         <form className="space-y-3">
                             <Input placeholder="Name" /> <Input placeholder="Email" /> <Textarea placeholder="Message" /> 
                             <Button className="bg-red-600 w-full">Send</Button>
                         </form>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>FAQ</CardTitle></CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="1"><AccordionTrigger>How to use AI?</AccordionTrigger><AccordionContent>Ask any question in Chat tab.</AccordionContent></AccordionItem>
                            <AccordionItem value="2"><AccordionTrigger>Emergency?</AccordionTrigger><AccordionContent>Press 115 button.</AccordionContent></AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </main>
      <MainNavigation />
    </div>
  )
}