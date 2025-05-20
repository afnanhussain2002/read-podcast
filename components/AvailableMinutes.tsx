"use client"
import { useUser } from '@/hooks/useUser';
import React, { useEffect } from 'react'
import { FaClockRotateLeft } from "react-icons/fa6";

const AvailableMinutes = () => {
    const { user, isLoading, refreshUser } = useUser();
    useEffect(() => {
        // optionally revalidate after a successful transcription
        refreshUser();
      }, [refreshUser]);
      if (isLoading) {
        return <p><FaClockRotateLeft className="animate-spin" /></p>
      }
      return <div>Available Minutes: {user?.transcriptMinutes.toFixed(2) || "0"}</div> ;
}

export default AvailableMinutes