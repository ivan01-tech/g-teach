"use client"

import React from "react"

import { useState } from "react"
import { Header } from "@/components/landing/header"
import { Footer } from "@/components/landing/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, MessageSquare, HelpCircle, Building } from "lucide-react"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const contactReasons = [
    { value: "general", label: "General Inquiry" },
    { value: "student", label: "Student Support" },
    { value: "tutor", label: "Tutor Support" },
    { value: "partnership", label: "Partnership" },
    { value: "press", label: "Press & Media" },
    { value: "other", label: "Other" },
  ]

  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      description: "For general inquiries",
      value: "contact@g-teach.com",
    },
    {
      icon: MessageSquare,
      title: "Student Support",
      description: "Help with your learning",
      value: "students@g-teach.com",
    },
    {
      icon: HelpCircle,
      title: "Tutor Support",
      description: "Help with your teaching",
      value: "tutors@g-teach.com",
    },
    {
      icon: Building,
      title: "Partnerships",
      description: "Business collaborations",
      value: "partners@g-teach.com",
    },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
                Contact Us
              </h1>
              <p className="mt-6 text-lg leading-8 text-muted-foreground">
                Have a question, suggestion, or partnership inquiry? We'd love
                to hear from you. Our team typically responds within 24 hours.
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form & Info */}
        <section className="py-16 lg:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Send Us a Message
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </p>

                {submitted ? (
                  <div className="mt-8 rounded-lg border border-accent bg-accent/10 p-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                      <Mail className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold text-foreground">
                      Message Sent!
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      Thank you for contacting us. We'll respond to your inquiry
                      within 24 hours.
                    </p>
                    <Button
                      className="mt-6 bg-transparent"
                      variant="outline"
                      onClick={() => setSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          name="firstName"
                          required
                          placeholder="John"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          name="lastName"
                          required
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        placeholder="john@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="reason">Reason for Contact</Label>
                      <Select name="reason" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a reason" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactReasons.map((reason) => (
                            <SelectItem key={reason.value} value={reason.value}>
                              {reason.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        name="subject"
                        required
                        placeholder="How can we help?"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </Button>
                  </form>
                )}
              </div>

              {/* Contact Info */}
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  Other Ways to Reach Us
                </h2>
                <p className="mt-2 text-muted-foreground">
                  Choose the best way to get in touch based on your needs.
                </p>

                <div className="mt-8 grid gap-4">
                  {contactInfo.map((info) => (
                    <Card key={info.title} className="border-border bg-card">
                      <CardContent className="flex items-start gap-4 p-4">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <info.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-medium text-foreground">
                            {info.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {info.description}
                          </p>
                          <a
                            href={`mailto:${info.value}`}
                            className="mt-1 text-sm font-medium text-primary hover:underline"
                          >
                            {info.value}
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* FAQ Link */}
                <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6">
                  <h3 className="font-semibold text-foreground">
                    Frequently Asked Questions
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Before reaching out, you might find your answer in our FAQ
                    section.
                  </p>
                  <Button variant="outline" className="mt-4 bg-transparent" asChild>
                    <a href="/faq">View FAQ</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
