"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, FileText, Video, BookOpen, Download } from "lucide-react"

const RESOURCES = [
  {
    category: "Teaching Materials",
    items: [
      {
        title: "Goethe A1-B2 Exam Guide",
        description: "Comprehensive guide for preparing students for Goethe exams",
        type: "pdf",
        badge: "Popular",
      },
      {
        title: "TELC Exam Structure",
        description: "Overview of TELC exam format and scoring",
        type: "pdf",
      },
      {
        title: "Grammar Worksheets Pack",
        description: "Printable worksheets for all levels",
        type: "pdf",
      },
    ],
  },
  {
    category: "Platform Guides",
    items: [
      {
        title: "Getting Started as a Tutor",
        description: "Learn how to set up your profile and attract students",
        type: "video",
        badge: "New",
      },
      {
        title: "Best Practices for Online Teaching",
        description: "Tips for effective virtual German lessons",
        type: "article",
      },
      {
        title: "Building Your Student Base",
        description: "Strategies to grow your tutoring business",
        type: "article",
      },
    ],
  },
]

export default function BetreuerResourcesPage() {
  const getIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-5 w-5" />
      case "video":
        return <Video className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Resources</h1>
        <p className="text-muted-foreground">
          Teaching materials and guides to help you succeed
        </p>
      </div>

      {RESOURCES.map((section) => (
        <Card key={section.category}>
          <CardHeader>
            <CardTitle>{section.category}</CardTitle>
            <CardDescription>
              {section.category === "Teaching Materials"
                ? "Materials to use in your lessons"
                : "Help and tips for using G-Teach"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.title}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">{item.title}</p>
                        {item.badge && (
                          <Badge variant="secondary" className="text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    {item.type === "pdf" ? (
                      <>
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </>
                    ) : (
                      <>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View
                      </>
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
