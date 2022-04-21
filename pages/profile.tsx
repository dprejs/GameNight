import React, { FC, useContext, useEffect, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import desktop from '../styles/profile/desktop.module.css';
import mobile from '../styles/profile/mobile.module.css';
import { Avatar, Button } from '@mui/material';
import { LogoutRounded, PersonRounded } from '@mui/icons-material';
import axios from 'axios';
import { useRouter } from 'next/router';
import { DeviceContext } from '../contexts/DeviceContext';
import { signOut } from 'firebase/auth';
import { auth } from '../components/firebase';


const Profile: FC = () => {
  const user = useContext(AuthContext);
  const device = useContext(DeviceContext);
  const router = useRouter();
  let styles;
  const avatarStyle = {
    width: 150,
    height: 150,
  }
  const buttonStyle = {
    marginRight: '5px',
    backgroundColor: 'var(--white)',
    color: 'black',
    border: '1px solid black',
    borderRadius: '10px',
    fontSize: 'small',
  }
  if(device.isMobile) {
    styles = mobile;
  } else {
    styles = desktop;
  }

  const [userDetails, setUserDetails] = useState(0)

  useEffect(() => {
    if (user) {
      axios.get(`../api/profile/?uid=${user.uid}`).then((res) => {
        setUserDetails(res.data.count)
      })
    }
  }, [user])

  const [userUpdateCount, setUserUpdateCount] = useState(0);
  useEffect(() => {
    if(!user) {
      if (userUpdateCount >= 1) {
        router.push('../login')
      } else {
        setTimeout(() => {
          setUserUpdateCount((count) => count + 1);
        }, 1000);
      }
    }
  }, [user, userUpdateCount]);

  const logout = () => {
    signOut(auth)
    .catch(error => console.log(error));
  }


  if (user) {
    return (
      <div className={styles.profilePage + ' center'}>
        {user && user.photoURL ? <Avatar
          src={user.photoURL}
          alt={`profile image`}
          sx={avatarStyle}
          className={styles.photo}
        /> : <Avatar sx={avatarStyle} className={styles.photo}>
          <PersonRounded sx={avatarStyle} />
        </Avatar>
        }
        <h2 className={styles.displayName}>
          {user.displayName.toUpperCase()}
        </h2>
        <div className={styles.gameCount}>
          games in library: {userDetails}
        </div>
        <div className={styles.friends}>
          Friends: Coming soon!
        </div>
        <Button
        className="iconButton"
        style={buttonStyle}
        onClick={logout}
        endIcon={<LogoutRounded />}
        >
          Logout
        </Button>

      </div>
    )
  } else {
    return (
      <div className="center loading">
        loading...
      </div>
    )
  }

}

export default Profile;