'use client';

import { useUser } from '@/hooks/useUser';
import { useState } from 'react';
// import toast from 'react-hot-toast';

export default function DeleteAllTranscriptsButton() {
  const [loading, setLoading] = useState(false);

  const {user} = useUser()

  console.log(user);
  

  const handleDeleteAll = async () => {
    const confirm = window.confirm('Are you sure you want to delete all transcripts?');
    if (!confirm) return;

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
        alert(data.message);
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
    <button
      onClick={handleDeleteAll}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg disabled:opacity-50"
    >
      {loading ? 'Deleting...' : 'Delete All Transcripts'}
    </button>
  );
}
