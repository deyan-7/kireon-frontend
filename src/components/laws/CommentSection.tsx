import React, { useMemo, useState } from 'react';
import { Comment } from '@/types/pflicht';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { TrashIcon } from '@heroicons/react/24/outline';
import { addComment, deleteComment } from '@/lib/services/pflicht-service';
import { useObjectRefreshStore } from '@/stores/objectRefreshStore';
import { useAuth } from '@/context/AuthContext';

type ObjectType = 'pflicht' | 'dokument';

interface CommentSectionProps {
  objectType: ObjectType;
  objectId: number | string;
  comments: Comment[] | null;
}

const CommentSection: React.FC<CommentSectionProps> = ({ objectType, objectId, comments }) => {
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeDeletion, setActiveDeletion] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const bump = useObjectRefreshStore((state) => state.bump);
  const { user } = useAuth();

  const currentUserId = useMemo(() => {
    if (!user) return null;
    return user.email ?? user.uid ?? null;
  }, [user]);

  const sortedComments = useMemo(() => {
    const list = comments ?? [];
    return [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
  }, [comments]);

  const textareaId = useMemo(() => `new-comment-${objectType}-${objectId}`, [objectType, objectId]);
  const resetState = () => {
    setNewComment('');
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const trimmed = newComment.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await addComment(objectType, objectId, trimmed);
      resetState();
      bump(objectType, objectId);
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
      bump(objectType, objectId);
    } catch (error) {
      console.error('Failed to delete comment', error);
      setErrorMessage(error instanceof Error ? error.message : 'Fehler beim Löschen des Kommentars.');
    } finally {
      setActiveDeletion(null);
    }
  };

  return (
    <section
      style={{
        marginTop: '1.5rem',
        padding: '1rem',
        borderRadius: '0.75rem',
        border: '1px solid #e5e7eb',
        backgroundColor: '#f9fafb',
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <header>
        <h3
          style={{
            margin: 0,
            fontSize: '0.875rem',
            color: '#374151',
            fontWeight: 600,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
          }}
        >
          Kommentare
        </h3>
      </header>

      {errorMessage ? (
        <div
          style={{
            padding: '0.75rem',
            borderRadius: '0.5rem',
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            color: '#B91C1C',
            fontSize: '0.875rem',
          }}
        >
          {errorMessage}
        </div>
      ) : null}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {sortedComments.length === 0 ? (
          <p style={{ fontSize: '0.875rem', color: '#6b7280', margin: 0 }}>Noch keine Kommentare.</p>
        ) : (
          sortedComments.map((comment) => {
            const canDelete =
              (currentUserId !== null && comment.created_by === currentUserId) ||
              (!user && comment.created_by === 'dev-user');
            const timestamp = new Date(comment.created_at);
            return (
              <div
                key={comment.id}
                style={{
                  paddingBottom: '0.75rem',
                  borderBottom: '1px solid #e5e7eb',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, color: '#1f2937', fontSize: '0.875rem' }}>
                      {comment.created_by}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
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
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#6b7280' }}
                    >
                      <TrashIcon style={{ width: '1rem', height: '1rem' }} />
                      {activeDeletion === comment.id ? 'Löschen...' : 'Löschen'}
                    </Button>
                  )}
                </div>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#374151', whiteSpace: 'pre-wrap' }}>
                  {comment.text}
                </p>
              </div>
            );
          })
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Label htmlFor={textareaId}>Neuer Kommentar</Label>
        <Textarea
          id={textareaId}
          rows={3}
          value={newComment}
          onChange={(event) => setNewComment(event.target.value)}
          placeholder="Schreiben Sie einen Kommentar..."
          disabled={isSubmitting}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button onClick={handleSubmit} disabled={isSubmitting || !newComment.trim()}>
            {isSubmitting ? 'Senden...' : 'Kommentar hinzufügen'}
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CommentSection;
