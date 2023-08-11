'use client';
import { useSession, signIn, signOut } from "next-auth/react"

//LINEログインボタン
const LineLoginButton = () => {
    const { data: session } = useSession()
    if (session) {
        return (
            <>
                Signed in as {session.user} <br />
                <button onClick={() => signOut()}>Sign out</button>
            </>
        )
    }
        return (
            <>
                Not signed in <br />
                <button onClick={() => signIn()}>Sign in</button>
            </>
        )
    }

export default LineLoginButton;