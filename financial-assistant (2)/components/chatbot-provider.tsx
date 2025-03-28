"use client"

import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Maximize2, Minimize2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

// Define a simple chat hook to replace the ai/react useChat
function useSimpleChat() {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    setInput(e.target.value)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input,
    }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate API delay
    setTimeout(() => {
      // Add bot response
      const responses = [
        "Based on your spending habits, I recommend creating a budget that allocates 50% for needs, 30% for wants, and 20% for savings and debt repayment.",
        "For retirement planning, aim to save at least 15% of your pre-tax income annually. Starting early is key to building a substantial nest egg.",
        "An emergency fund should cover 3-6 months of essential expenses. Keep this money in a high-yield savings account for easy access.",
        "When investing, diversification is important. Consider a mix of stocks, bonds, and other assets based on your risk tolerance and time horizon.",
        "To reduce monthly expenses, review subscription services you rarely use, refinance high-interest loans, and consider meal planning to reduce food costs.",
        "The 50/30/20 budget rule is a simple framework: 50% of income for necessities, 30% for discretionary spending, and 20% for financial goals.",
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]

      const botMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: randomResponse,
      }
      setMessages((prev) => [...prev, botMessage])
      setIsLoading(false)
    }, 1000)
  }

  return { messages, input, handleInputChange, handleSubmit, isLoading }
}

export function ChatbotProvider() {
  const [isOpen, setIsOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useSimpleChat()

  const toggleChat = () => setIsOpen(!isOpen)
  const toggleExpand = () => setIsExpanded(!isExpanded)

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  return (
    <>
      {/* Floating chat button */}
      <Button onClick={toggleChat} className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg" size="icon">
        {isOpen ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card
          className={cn(
            "fixed right-4 shadow-lg transition-all duration-300 ease-in-out",
            isExpanded ? "top-4 left-4 bottom-20 w-auto" : "bottom-20 right-4 w-80 md:w-96",
          )}
        >
          <CardHeader className="pb-2 flex flex-row items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" />
              Financial Assistant
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleExpand} className="h-8 w-8">
              {isExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </Button>
          </CardHeader>
          <CardContent className={cn("overflow-y-auto space-y-4 pb-2", isExpanded ? "h-[calc(100%-120px)]" : "h-80")}>
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full space-y-4 text-center p-4">
                <div className="rounded-full bg-primary/10 p-3">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium">Welcome to MoneyMinder Assistant</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask me anything about your finances, budgeting, or for financial advice!
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-2 w-full mt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto py-2"
                    onClick={() =>
                      handleInputChange({ target: { value: "How can I save more money each month?" } } as any)
                    }
                  >
                    How can I save more money each month?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto py-2"
                    onClick={() => handleInputChange({ target: { value: "What's a good budget breakdown?" } } as any)}
                  >
                    What's a good budget breakdown?
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-left justify-start h-auto py-2"
                    onClick={() =>
                      handleInputChange({ target: { value: "How much should I save for retirement?" } } as any)
                    }
                  >
                    How much should I save for retirement?
                  </Button>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-2 ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary"
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))
            )}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[80%] rounded-lg px-4 py-2 bg-secondary">
                  <div className="flex space-x-2">
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-75"></div>
                    <div className="h-2 w-2 rounded-full bg-muted-foreground animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>
          <CardFooter className="pt-0">
            <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
              <Input placeholder="Ask a question..." value={input} onChange={handleInputChange} className="flex-1" />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardFooter>
        </Card>
      )}
    </>
  )
}

