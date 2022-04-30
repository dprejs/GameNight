import { useRouter } from "next/router";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../contexts/AuthContext";

const  redirect = () => {
  const router = useRouter();
  const user = useContext(AuthContext);
  const [userUpdateCount, setUserUpdateCount] = useState(0);
  useEffect(() => {
    if (user) {
      router.push(`/library/${user.uid}`);
    } else {
      if (userUpdateCount >= 1) {
        router.push('../login')
      } else {
        setTimeout(() => {
          setUserUpdateCount((count) => count + 1);
        }, 500);
      }
    }
  }, [user, userUpdateCount]);
  useEffect(() => {
    if (user) {
      console.log(user.uid);
    }
  }, [user])


  return (
    <div className="center">
      loading...
    </div>
  )
}

export default redirect;