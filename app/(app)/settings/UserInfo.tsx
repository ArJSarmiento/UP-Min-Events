'use client'

import styles from './page.module.css'
import { Inter } from 'next/font/google'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useUserTypeContext } from '../../providers/UserTypeProvider'

import { auth, db } from "../../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import Loading from '@/app/(scan)/scan/loading'

const inter = Inter({ subsets: ['latin']})

interface userDetails {
    firstName: string
    lastName: string
    studentNumber: string
}

export default function UserInfo(){

    const [userDetails, setUserDetails] = useState<userDetails>({ firstName: '', lastName: '', studentNumber: '' })
    const [user, loading] = useAuthState(auth)
    const { userType } = useUserTypeContext()
    const url = user?.photoURL as string

    const fullName = userDetails.firstName + ' ' + userDetails.lastName
    
    const getUserDetails = async () => {
        if (userType === 'attendee') {
            const docSnap = await getDoc(doc(db, 'attendees', `${user?.uid}`))
            
            if (docSnap.exists()) {
                setUserDetails(docSnap.data() as userDetails)
            }
        } else {
            const docSnap = await getDoc(doc(db, 'organizers', `${user?.uid}`))
            
            if (docSnap.exists()) {
                setUserDetails(docSnap.data() as userDetails)
            }
        }
    }

    useEffect(() => {
        getUserDetails()
    }, [user, loading])

    return (
        <>
            {user && !loading && (
                <div className={`${inter.className} ${styles.headerContainer}`}>
                    <div className={styles.nav}>
                        <Link href="/"> 
                            <ArrowBackIcon sx={{ scale: '125%', color: '#a70000', p: '0' }} /> 
                        </Link> 
                    </div>
                    <div className={styles.header}>
                        <Image className={styles.img} src={url} alt='user avatar' width='100' height='100' priority/> 
                        <h2> {fullName} </h2>
                        <p> {user.email} </p>
                        <p> {userDetails.studentNumber} </p>
                    </div>
                </div>
            )}
        </>
    )
}