"use client"

import { School } from "@/lib/types"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useTranslations } from "next-intl"
import {
  Phone,
  Mail,
  Globe,
  MapPin,
  Copy,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface SchoolContactDialogProps {
  open: boolean
  school?: School
  onOpenChange: (open: boolean) => void
}

export function SchoolContactDialog({ open, school, onOpenChange }: SchoolContactDialogProps) {
  const t = useTranslations()
  const { toast } = useToast()

  if (!school) return null

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: t("Copied"),
      description: `${label} ${t("copied to clipboard")}`,
    })
  }

  const contacts = [
    {
      icon: Phone,
      label: t("Phone"),
      value: school.phone,
      action: () => copyToClipboard(school.phone!, t("Phone")),
    },
    {
      icon: Mail,
      label: t("Email"),
      value: school.email,
      action: () => copyToClipboard(school.email!, t("Email")),
    },
    {
      icon: Globe,
      label: t("Website"),
      value: school.website,
      isLink: true,
      action: () => school.website && window.open(school.website, "_blank"),
    },
  ]

  const socialLinks = [
    {
      icon: Facebook,
      name: "Facebook",
      url: school.socialMedia?.facebook,
    },
    {
      icon: Twitter,
      name: "Twitter",
      url: school.socialMedia?.twitter,
    },
    {
      icon: Instagram,
      name: "Instagram",
      url: school.socialMedia?.instagram,
    },
    {
      icon: Linkedin,
      name: "LinkedIn",
      url: school.socialMedia?.linkedin,
    },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{school.name} - {t("Contact Information")}</DialogTitle>
          <DialogDescription>
            {t("Manage and share school contact details")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                {t("Location")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <p className="text-sm text-muted-foreground">{t("Address")}</p>
                <p className="font-medium">
                  {school.location.address || `${school.location.city}, ${school.location.country}`}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-3">
                <div>
                  <p className="text-sm text-muted-foreground">{t("City")}</p>
                  <p className="font-medium">{school.location.city}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("Country")}</p>
                  <p className="font-medium">{school.location.country}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Methods */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("Contact Methods")}</CardTitle>
              <CardDescription>
                {t("Ways to reach the school")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {contacts.map((contact) => {
                const Icon = contact.icon
                return contact.value ? (
                  <div key={contact.label} className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <Icon className="h-5 w-5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-muted-foreground">{contact.label}</p>
                        {contact.isLink ? (
                          <a
                            href={contact.value}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-medium text-blue-600 hover:underline truncate"
                          >
                            {contact.value}
                          </a>
                        ) : (
                          <p className="font-medium truncate">{contact.value}</p>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={contact.action}
                      className="ml-2 shrink-0"
                    >
                      {contact.isLink ? (
                        <Globe className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                ) : null
              })}
            </CardContent>
          </Card>

          {/* Social Media */}
          {socialLinks.some((s) => s.url) && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">{t("Social Media")}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {socialLinks.map((social) => {
                    const Icon = social.icon
                    return social.url ? (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center h-10 w-10 rounded-full border border-border hover:bg-muted transition-colors"
                        title={social.name}
                      >
                        <Icon className="h-5 w-5" />
                      </a>
                    ) : null
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Share */}
          <Card className="bg-muted/50 border-muted">
            <CardHeader>
              <CardTitle className="text-base">{t("Share School")}</CardTitle>
            </CardHeader>
            <CardContent className="flex gap-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  const text = `Check out ${school.name}! ${window.location.origin}`
                  navigator.clipboard.writeText(text)
                  toast({
                    title: t("Link copied"),
                    description: t("Share the school link"),
                  })
                }}
              >
                {t("Copy Link")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}
