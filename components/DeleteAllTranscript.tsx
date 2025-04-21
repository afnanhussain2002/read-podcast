'use client';

import { useUser } from '@/hooks/useUser';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import ConfirmDialog from './ShowAlert';

export default function DeleteAllTranscriptsButton({
  onDeleted,
}: {
  onDeleted: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const { user } = useUser();

  const handleDeleteAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/delete-all', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: user?.id }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(data.message); // Optional: swap with toast if you prefer
        onDeleted(); // Immediately update the frontend
      } else {
        alert(data.message || 'Failed to delete transcripts');
      }
    } catch (error) {
      console.error('Error deleting transcripts:', error);
      alert('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfirmDialog
      title="Delete all transcripts?"
      description="This action cannot be undone. It will permanently delete all your transcripts from our database."
      onConfirm={handleDeleteAll}
      loading={loading}
      trigger={
        <Button variant="default" disabled={loading}>
          {loading ? 'Deleting...' : 'Delete All Transcripts'}
        </Button>
      }
    />
  );
}
