"use client"

import React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  FileText,
  Upload,
  Trash2,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  Download,
  Shield,
} from "lucide-react"
import { useAuth } from "@/hooks/use-auth"
import { useTutorProfile } from "@/hooks/use-tutor-profile"
import { uploadTutorDocument, deleteTutorDocument } from "@/lib/services/tutor-service"
import type { TutorDocument } from "@/lib/types"

const DOCUMENT_TYPES = [
  { value: "certificate", label: "Language Certificate", description: "Goethe, TELC, etc." },
  { value: "diploma", label: "Diploma / Degree", description: "Teaching qualification" },
  { value: "cv", label: "CV / Resume", description: "Your professional experience" },
  { value: "other", label: "Other", description: "Additional documents" },
]

export default function BetreuerDocumentsPage() {
  const { user } = useAuth()
  const { tutorProfile, loading } = useTutorProfile()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [uploading, setUploading] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedType, setSelectedType] = useState<TutorDocument["type"]>("certificate")

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !user) return

    setUploading(true)
    try {
      await uploadTutorDocument(user.uid, file, selectedType)
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const handleDelete = async (doc: TutorDocument) => {
    if (!user) return
    
    setDeleting(doc.id)
    try {
      await deleteTutorDocument(user.uid, doc.id, doc.url)
    } catch (error) {
      console.error("Error deleting document:", error)
    } finally {
      setDeleting(null)
    }
  }

  const getStatusBadge = (status: TutorDocument["status"]) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-500/10 text-green-600 border-green-500/20">
            <CheckCircle2 className="mr-1 h-3 w-3" />
            Verified
          </Badge>
        )
      case "rejected":
        return (
          <Badge variant="destructive">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      default:
        return (
          <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
    }
  }

  const getDocumentIcon = (type: TutorDocument["type"]) => {
    return <FileText className="h-8 w-8 text-muted-foreground" />
  }

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  const documents = tutorProfile?.documents || []

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Document Verification</h1>
        <p className="text-muted-foreground">
          Upload your credentials to verify your profile. This ensures quality for our students.
        </p>
      </div>

      {/* Info Alert */}
      <Alert className="border-primary/20 bg-primary/5">
        <Shield className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Profile Verification</AlertTitle>
        <AlertDescription className="text-primary/80">
          To ensure the quality of G-Teach, each tutor must provide supporting documents.
          Your profile will be activated after validation by our team.
        </AlertDescription>
      </Alert>

      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
          <CardDescription>
            Upload certificates, diplomas, or other credentials
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Document Type</label>
              <Select
                value={selectedType}
                onValueChange={(value) => setSelectedType(value as TutorDocument["type"])}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DOCUMENT_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div>
                        <span>{type.label}</span>
                        <span className="ml-2 text-xs text-muted-foreground">
                          ({type.description})
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-lg border-2 border-dashed border-border p-8 text-center">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              className="hidden"
            />
            <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
            <p className="mt-2 text-sm font-medium">
              Drop your file here or click to upload
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              PDF, JPG, PNG or DOC up to 10MB
            </p>
            <Button
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Select File
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            {documents.length === 0
              ? "No documents uploaded yet"
              : `${documents.length} document(s) uploaded`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {documents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertCircle className="h-10 w-10 text-muted-foreground" />
              <p className="mt-2 text-sm font-medium">No documents uploaded</p>
              <p className="text-xs text-muted-foreground">
                Upload your credentials to get verified
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border border-border p-4"
                >
                  <div className="flex items-center gap-4">
                    {getDocumentIcon(doc.type)}
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {doc.type.replace("-", " ")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {getStatusBadge(doc.status)}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        asChild
                      >
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download</span>
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(doc)}
                        disabled={deleting === doc.id}
                      >
                        {deleting === doc.id ? (
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                        ) : (
                          <Trash2 className="h-4 w-4 text-destructive" />
                        )}
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Required Documents */}
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>
            Please upload the following to complete your verification
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {DOCUMENT_TYPES.slice(0, 2).map((type) => {
              const hasDocument = documents.some((d) => d.type === type.value)
              return (
                <div
                  key={type.value}
                  className="flex items-center justify-between rounded-lg border border-border p-3"
                >
                  <div className="flex items-center gap-3">
                    {hasDocument ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="font-medium">{type.label}</p>
                      <p className="text-sm text-muted-foreground">
                        {type.description}
                      </p>
                    </div>
                  </div>
                  <Badge variant={hasDocument ? "default" : "secondary"}>
                    {hasDocument ? "Uploaded" : "Required"}
                  </Badge>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
