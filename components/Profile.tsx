import { FaRegUserCircle } from "react-icons/fa";
import { useResponsive } from "@/hooks/useResponsive";
import { useEffect, useState } from "react";
import { label } from "three/examples/jsm/nodes/Nodes.js";

type UserGenderType = '男性' | '女性' | '選択しない'
// type UserGenderType = {S: '男性'} | {S: '女性'} | {S: '選択しない'};

const Profile = () => {
  const { isDeskTop } = useResponsive()
  const [isEditMode,setIsEditMode] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPrefecture, setUserPrefecture] = useState<string>('');
  const [userBirthday, setUserBirthday] = useState<string>('');
  const [userGender, setUserGender] = useState<UserGenderType>('選択しない');
  const [userId, setUserId] = useState<string>('97004af5-b779-48c3-be71-44d8983a675d');

  interface UserProfile  {
    userName: {S: string};
    userPrefecture: {S: string};
    userBirthday: {S: string};
    // userGender: UserGenderType;
    userGender: {S: UserGenderType};
  }

  const fetchUserInfo = async () => {
    const res = await fetch(`/api/user?id=${userId}`)

    const userProfile : UserProfile = await res.json();

    setUserName(userProfile.userName.S);
    setUserPrefecture(userProfile.userPrefecture.S);
    setUserBirthday(userProfile.userBirthday.S);
    setUserGender(userProfile.userGender.S);
  };
  useEffect(()=>{
    fetchUserInfo();
  },[]);

  const handleSubmit = (e:any) => {
    e.preventDefault();
    
    fetch(`/api/user?id`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: userId,
        userName: userName,
        userPrefecture: userPrefecture,
        userBirthday: userBirthday,
        userGender: userGender,
      }),
    })
    .then(response => response.json())
    .then(data => {
      setIsEditMode(false);
      setUserName(data.userName);
      setUserPrefecture(data.userPrefecture);
      setUserBirthday(data.userBirthday);
      setUserGender(data.userGender);
    })
    .catch((error) => console.error('Error:', error));
  };

  return (
    isEditMode ?
    <div>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center">
          <FaRegUserCircle className={`text-[50px] -ml-1 mr-5 ${isDeskTop ? 'text-black' : 'text-white'} self-start `}/>
          <div>
            <label htmlFor="">名前：</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)}/>
          </div>
        </div>

        <div className="flex flex-col">
          <label>都道府県：</label>
          <input type="text" value={userPrefecture} onChange={(e) => setUserPrefecture(e.target.value)}/>

          <span>生年月日：</span>
          <input type="text" value={userBirthday} onChange={(e) => setUserBirthday(String(e.target.value))}/>

          <label htmlFor="">性別：</label>
          <select name="" id="" value={userGender} onChange={(e) => setUserGender(e.target.value as UserGenderType)}>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="選択しない">選択しない</option>
          </select>
        </div>
        <button type="submit">登録・更新</button>
      </form>
    </div>
    :
    <>
      <div className="flex flex-col mb-5">
        <div className="flex mb-3 items-center">
          <FaRegUserCircle className={`text-[50px] -ml-1 mr-5 ${isDeskTop ? 'text-black' : 'text-white'} self-start `}/>
          <p className="text-2xl">{userName}</p>
        </div>
        <p>{userPrefecture}</p>
        <p>{userBirthday}</p>
        <p>{userGender}</p>
      </div>
      <div className='bg-stone-300 w-20 text-black text-center rounded-md' onClick={() => setIsEditMode(true)}>編集する</div>
    </>
  );
};

export default Profile;