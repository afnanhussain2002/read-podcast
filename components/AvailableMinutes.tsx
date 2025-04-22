"use client"
import { useUser } from '@/hooks/useUser';
import React, { useEffect } from 'react'
import Loader from './Loader';

const AvailableMinutes = () => {
    const { user, isLoading, refreshUser } = useUser();
    useEffect(() => {
        // optionally revalidate after a successful transcription
        refreshUser();
      }, [refreshUser]);
      if (isLoading) {
        return <Loader/>
      }
      return <div>Available Minutes: {user?.transcriptMinutes.toFixed(2)}</div>;
}

export default AvailableMinutes