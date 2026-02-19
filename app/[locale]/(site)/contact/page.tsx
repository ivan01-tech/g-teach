"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
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
import { contactService } from "@/lib/services/contact-service"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const t = useTranslations("contact")

  const contactReasons = [
    { value: "general", key: "general" },
    { value: "student", key: "student" },
    { value: "tutor",  key: "tutor" },
    { value: "partnership", key: "partnership" },
    { value: "press", key: "press" },
    { value: "other", key: "other" },
  ]

  const contactInfo = [
    { icon: Mail,       key: "email" },
    { icon: MessageSquare, key: "student" },
    { icon: HelpCircle, key: "tutor" },
    { icon: Building,   key: "partnership" },
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = {
        firstName: formData.get("firstName") as string,
        lastName: formData.get("lastName") as string,
        email: formData.get("email") as string,
        reason: formData.get("reason") as string,
        subject: formData.get("subject") as string,
        message: formData.get("message") as string,
      }

      await contactService.submitContactInquiry(data)
      setSubmitted(true)
    } catch (error) {
      console.error("Failed to submit contact inquiry:", error)
      // Optionnel : ajouter un toast d'erreur ici plus tard
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <section className="border-b border-border bg-muted/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
              {t("pageTitle")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              {t("pageSubtitle")}
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Formulaire */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("sendMessageTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("sendMessageSubtitle")}
              </p>

              {submitted ? (
                <div className="mt-8 rounded-lg border border-accent bg-accent/10 p-8 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/20">
                    <Mail className="h-6 w-6 text-accent" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">
                    {t("successTitle")}
                  </h3>
                  <p className="mt-2 text-muted-foreground">
                    {t("successMessage")}
                  </p>
                  <Button
                    className="mt-6 bg-transparent"
                    variant="outline"
                    onClick={() => setSubmitted(false)}
                  >
                    {t("sendAnother")}
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                  <div className="grid gap-6 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">{t("firstNameLabel")}</Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        required
                        placeholder={t("firstNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">{t("lastNameLabel")}</Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        required
                        placeholder={t("lastNamePlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("emailLabel")}</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      placeholder={t("emailPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reason">{t("reasonLabel")}</Label>
                    <Select name="reason" required>
                      <SelectTrigger>
                        <SelectValue placeholder={t("reasonPlaceholder")} />
                      </SelectTrigger>
                      <SelectContent>
                        {contactReasons.map((reason) => (
                          <SelectItem key={reason.value} value={reason.value}>
                            {t(`reasons.${reason.key}`)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">{t("subjectLabel")}</Label>
                    <Input
                      id="subject"
                      name="subject"
                      required
                      placeholder={t("subjectPlaceholder")}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">{t("messageLabel")}</Label>
                    <Textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      placeholder={t("messagePlaceholder")}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? t("sendingButton") : t("sendButton")}
                  </Button>
                </form>
              )}
            </div>

            {/* Autres moyens + FAQ */}
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                {t("otherWaysTitle")}
              </h2>
              <p className="mt-2 text-muted-foreground">
                {t("otherWaysSubtitle")}
              </p>

              <div className="mt-8 grid gap-4">
                {contactInfo.map((info) => (
                  <Card key={info.key} className="border-border bg-card">
                    <CardContent className="flex items-start gap-4 p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <info.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground">
                          {t(`contactCards.${info.key}.title`)}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {t(`contactCards.${info.key}.description`)}
                        </p>
                        <a
                          href="mailto:contact.gteach@gmail.com"
                          className="mt-1 text-sm font-medium text-primary hover:underline"
                        >
                          contact.gteach@gmail.com
                        </a>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="mt-8 rounded-lg border border-border bg-muted/50 p-6">
                <h3 className="font-semibold text-foreground">
                  {t("faqTitle")}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {t("faqSubtitle")}
                </p>
                <Button variant="outline" className="mt-4 bg-transparent" asChild>
                  <a href="/faq">{t("viewFaq")}</a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}