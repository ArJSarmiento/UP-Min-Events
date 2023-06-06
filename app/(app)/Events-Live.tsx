'use client'

import Event from './Event'

import { useState, useEffect } from 'react'

import { db } from '@/firebaseConfig'
import { collection, getDocs, where, query } from 'firebase/firestore'

interface Event {
    name: string;
    date: Date;
    startTime: string;
    endTime: string;
    venue: string;
    id: string;
}

export default function Live() {

    const eventscollection = collection(db, 'events')
    const [events, setEvents] = useState<Event[]>([])

    const dateToday = new Date()
    dateToday.setHours(0, 0, 0, 0)

    const getEvents = async () => {
        const q = query(
            eventscollection, 
            where('date', '==', dateToday),
            where('visibility', '==', 'Public')    
        )
        const querySnapshot = await getDocs(q)
        const events: Event[] = []

        querySnapshot.forEach((doc) => {
            events.push({
                name: doc.data().name,
                date: doc.data().date.toDate(),
                startTime: doc.data().startTime,
                endTime: doc.data().endTime,
                venue: doc.data().venue,
                id: doc.id
            })
        })

        setEvents(events)

        // Sort events by date and time
        const sortedEvents = [...events].sort((a, b) => {
            const dateComparison = a.date.getTime() - b.date.getTime();
            if (dateComparison === 0) {
                // If dates are the same, compare start times
                return a.startTime.localeCompare(b.startTime);
            }
            return dateComparison;
        });
    
        setEvents(sortedEvents)
    }

    useEffect(() => {
        getEvents()
    }, [])

    return (
        <>
            {
                events.map((event) => (
                    <Event
                        key={event.id}
                        name={event.name}
                        date={event.date}
                        startTime={event.startTime}
                        endTime={event.endTime}
                        venue={event.venue}
                        id={event.id}
                    />
                ))
            }
        </>
    )
}