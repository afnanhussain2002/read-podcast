"use client"
import { useUser } from '@/hooks/useUser';
import React, { useEffect } from 'react'

const AvailableMinutes = () => {
    const { user, isLoading, refreshUser } = useUser();
    useEffect(() => {
        // optionally revalidate after a successful transcription
        refreshUser();
      }, [refreshUser]);
      if (isLoading) {
        return <p>Minutes Left.......</p>
      }
      return <div>Available Minutes: {user?.transcriptMinutes.toFixed(2)}</div>;
}

export default AvailableMinutes