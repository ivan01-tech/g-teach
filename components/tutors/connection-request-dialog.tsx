"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useInitiateConnection } from "@/hooks/use-initiate-connection";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTranslations } from "next-intl";

interface ConnectionRequestDialogProps {
  open: boolean;
  tutorId: string;
  tutorName: string;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

// On n'utilise plus de tableau statique → tout passe par les traductions
export function ConnectionRequestDialog({
  open,
  tutorId,
  tutorName,
  onOpenChange,
  onSuccess,
}: ConnectionRequestDialogProps) {
  const t = useTranslations("connectionRequest"); // namespace cohérent

  const { initiateConnection, loading, error } = useInitiateConnection();

  const [subject, setSubject] = useState("");
  const [lessonType, setLessonType] = useState("");
  const [notes, setNotes] = useState("");
  const [success, setSuccess] = useState(false);

  const lessonTypeOptions = [
    "one-time",
    "regular",
    "exam-prep",
    "conversation",
  ] as const;

  const handleSubmit = async () => {
    const connection = await initiateConnection(tutorId, tutorName, {
      subject: subject.trim() || undefined,
      proposedLessonType: lessonType || undefined,
      notes: notes.trim() || undefined,
    });

    if (connection) {
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setSubject("");
        setLessonType("");
        setNotes("");
        onOpenChange(false);
        onSuccess?.();
      }, 1800); // un peu plus long pour bien voir le succès
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>
            {t("description", { tutorName })}
          </DialogDescription>
        </DialogHeader>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
            <p className="text-center font-medium text-foreground">
              {t("success.title")}
            </p>
            <p className="text-center text-sm text-muted-foreground">
              {t("success.description", { tutorName })}
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="subject">{t("fields.subject.label")}</Label>
              <Input
                id="subject"
                placeholder={t("fields.subject.placeholder")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lesson-type">{t("fields.lessonType.label")}</Label>
              <Select value={lessonType} onValueChange={setLessonType} disabled={loading}>
                <SelectTrigger id="lesson-type">
                  <SelectValue placeholder={t("fields.lessonType.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {lessonTypeOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`lessonTypes.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">{t("fields.notes.label")}</Label>
              <Textarea
                id="notes"
                placeholder={t("fields.notes.placeholder")}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                disabled={loading}
                rows={4}
              />
            </div>
          </div>
        )}

        {!success && (
          <DialogFooter className="mt-6 gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
              className="w-full sm:w-auto"
            >
              {t("actions.cancel")}
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading || !subject.trim()}
              className="w-full sm:w-auto"
            >
              {loading ? t("actions.sending") : t("actions.send")}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}