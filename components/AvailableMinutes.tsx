"use client"
import { useUser } from '@/hooks/useUser';
import React, { useEffect } from 'react'
import Star10 from './stars/s10';

const AvailableMinutes = () => {
    const { user, isLoading, refreshUser } = useUser();
    useEffect(() => {
        // optionally revalidate after a successful transcription
        refreshUser();
      }, [refreshUser]);
      if (isLoading) {
        return <Star10 size={100} strokeWidth={4} className="animate-spin text-brand-glow shadow-light dark:shadow-dark" />
      }
      return <div>Available Minutes: {user?.transcriptMinutes}</div>;
}

export default AvailableMinutes