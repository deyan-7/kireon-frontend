import React, { useEffect, useMemo, useState } from 'react';
import { Comment } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrashIcon } from '@heroicons/react/24/outline';
import { MessageSquare } from 'lucide-react';
import { addComment, deleteComment } from '@/lib/services/pflicht-service';
import { useObjectRefreshStore } from '@/stores/objectRefreshStore';
import { useAuth } from '@/context/AuthContext';

type ObjectType = 'pflicht' | 'dokument';

interface CommentSectionProps {
  objectType: ObjectType;
  objectId: number | string;
  comments: Comment[] | null;
  onCommentAdded?: (comment: Comment) => void;
  onCommentDeleted?: (commentId: number) => void;
}

const CommentSection: React.FC<CommentSectionProps> = ({ objectType, objectId, comments, onCommentAdded, onCommentDeleted }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDeletion, setActiveDeletion] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bump = useObjectRefreshStore((state) => state.bump);
  const { user } = useAuth();
  const [internalComments, setInternalComments] = useState<Comment[]>(comments ?? []);

  useEffect(() => {
    setInternalComments(comments ?? []);
  }, [comments]);

  const currentUserId = useMemo(() => {
    if (!user) return null;
    return user.email ?? user.uid ?? null;
  }, [user]);

  const sortedComments = useMemo(() => {
    const list = internalComments ?? [];
    return [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [internalComments]);

  const textareaId = useMemo(() => `new-comment-${objectType}-${objectId}`, [objectType, objectId]);
  const resetState = () => {
    setNewComment('');
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      const createdComment = await addComment(objectType, objectId, trimmed);
      resetState();
      setInternalComments((prev) => [...prev, createdComment]);
      if (onCommentAdded) {
        onCommentAdded(createdComment);
      } else {
        bump(objectType, objectId);
      }
    } catch (error) {
      console.error('Failed to add comment', error);
      setErrorMessage(error instanceof Error ? error.message : 'Fehler beim Hinzufügen des Kommentars.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (commentId: number) => {
    if (!window.confirm('Kommentar wirklich löschen?')) return;

    setActiveDeletion(commentId);
    setErrorMessage(null);
    try {
      await deleteComment(objectType, objectId, commentId);
      setInternalComments((prev) => prev.filter((comment) => comment.id !== commentId));
      if (onCommentDeleted) {
        onCommentDeleted(commentId);
      } else {
        bump(objectType, objectId);
      }
    } catch (error) {
      console.error('Failed to delete comment', error);
      setErrorMessage(error instanceof Error ? error.message : 'Fehler beim Löschen des Kommentars.');
    } finally {
      setActiveDeletion(null);
    }
  };

  const handleTextareaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  };

  return (
    <Card className="border-l-4 border-l-emerald-500 border-slate-200 bg-white shadow-md">
      <CardHeader className="flex flex-row items-center gap-2 border-b border-slate-100 pb-3">
        <MessageSquare className="h-4 w-4 text-emerald-600" />
        <CardTitle className="text-base font-semibold text-slate-900">Kommentare</CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="space-y-6">
          {errorMessage && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
              {errorMessage}
            </div>
          )}

          <div className="space-y-4">
            {sortedComments.length === 0 ? (
              <p className="text-sm text-muted-foreground">Noch keine Kommentare.</p>
            ) : (
              sortedComments.map((comment) => {
                const canDelete =
                  (currentUserId !== null && comment.created_by === currentUserId) ||
                  (!user && comment.created_by === 'dev-user');
                const timestamp = new Date(comment.created_at);
                return (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-slate-200 bg-slate-50/70 p-4 shadow-[0_1px_0_rgba(148,163,184,0.2)]"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-sm text-slate-900">
                        <span className="font-semibold">{comment.created_by}</span>
                        <span className="text-xs text-muted-foreground">
                          {Number.isNaN(timestamp.getTime())
                            ? comment.created_at
                            : timestamp.toLocaleString('de-DE')}
                        </span>
                      </div>
                      {canDelete && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(comment.id)}
                          disabled={activeDeletion === comment.id}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <TrashIcon className="h-4 w-4" />
                          {activeDeletion === comment.id ? 'Löschen...' : 'Löschen'}
                        </Button>
                      )}
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{comment.text}</p>
                  </div>
                );
              })
            )}
          </div>

          <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <Label htmlFor={textareaId} className="text-sm font-medium text-slate-900">
              Neuer Kommentar
            </Label>
            <Textarea
              id={textareaId}
              rows={3}
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              onKeyDown={handleTextareaKeyDown}
              placeholder="Schreiben Sie einen Kommentar..."
              disabled={isSubmitting}
              className="border-slate-300 bg-white focus-visible:border-slate-400"
            />
            <div className="flex justify-end">
              <Button onClick={handleSubmit} disabled={isSubmitting || !newComment.trim()}>
                {isSubmitting ? 'Senden...' : 'Kommentar hinzufügen'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CommentSection;
