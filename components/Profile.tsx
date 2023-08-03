import { FaRegUserCircle } from "react-icons/fa";
import { useResponsive } from "@/hooks/useResponsive";
import { useEffect, useState } from "react";
import { label } from "three/examples/jsm/nodes/Nodes.js";
import { Prefecture, UserGenderType, UserProfile } from "@/utils/types";
import { prefectures } from "@/utils/constants";

const Profile = () => {
  const { isDeskTop } = useResponsive()
  const [isEditMode,setIsEditMode] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPrefecture, setUserPrefecture] = useState<Prefecture>();
  const [userBirthday, setUserBirthday] = useState<string>('');
  const [userGender, setUserGender] = useState<UserGenderType>('選択しない');
  // const [userId, setUserId] = useState<string>('97004af5-b779-48c3-be71-44d8983a675d');
  const [userId, setUserId] = useState<string>('ef20c6c7-ee48-427b-9d34-8fd60d4629ca');


  const fetchUserInfo = async () => {
    const res = await fetch(`/api/user?id=${userId}`)

    const userProfile : UserProfile = await res.json();
    console.log('userProfile->',userProfile)

    setUserName(userProfile.userName.S);
    setUserPrefecture(userProfile.userPrefecture.S);
    setUserBirthday(userProfile.userBirthday.S);
    setUserGender(userProfile.userGender.S);
  };
  useEffect(()=>{
    fetchUserInfo();
  },[isEditMode]);

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
    .then((data: UserProfile) => {
      setIsEditMode(false);
      setUserName(data.userName.S);
      setUserPrefecture(data.userPrefecture.S);
      setUserBirthday(data.userBirthday.S);
      setUserGender(data.userGender.S);
    })
    .catch((error) => console.error('Error:', error));
  };

  return (
    <>
      <div className="flex justify-between">
        <h2 className="mb-3 font-bold">プロフィール</h2>
        {isEditMode ? 
          <></>
          :
          <div className='bg-stone-300 h-7 w-20 text-black text-center rounded-md cursor-pointer' onClick={() => setIsEditMode(true)}>編集する</div>
        }
      </div>
      {
        isEditMode ?
        <div>
          <form onSubmit={handleSubmit}>
            <div className="flex items-center mb-5">
              <FaRegUserCircle className={`text-[50px] -ml-1 mr-5 text-white self-center`}/>
              <div>
                <label htmlFor="">名前：</label>
                <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="rounded-md p-2 w-full"/>
              </div>
            </div>
    
            <div className="flex flex-col mb-5">
              <label>都道府県：</label>
              <select className="rounded-md p-2 mb-5" value={userPrefecture} onChange={(e) => setUserPrefecture(e.target.value as Prefecture)}>
                {
                  prefectures.map((prefecture,index)=> {
                    return (
                      <option key={index} value={prefecture}>{prefecture}</option>
                    );
                  })
                }
              </select>
    
              <span>生年月日：</span>
              <input type="text" className="rounded-md p-2 mb-5" value={userBirthday} onChange={(e) => setUserBirthday(String(e.target.value))}/>
    
              <label htmlFor="">性別：</label>
              <select name="" id="" value={userGender} className="rounded-md p-2" onChange={(e) => setUserGender(e.target.value as UserGenderType)}>
                <option value="男性">男性</option>
                <option value="女性">女性</option>
                <option value="選択しない">選択しない</option>
              </select>
            </div>
            <div className="flex justify-between">
              <div className='bg-stone-300 w-24 text-black text-center rounded-md cursor-pointer' onClick={() => setIsEditMode(false)}>キャンセル</div>
              <button type="submit" className='bg-stone-300 w-24 text-black text-center rounded-md'>更新する</button>
            </div>
    
          </form>
        </div>
        :
        <div className="w-full">
          <div className="flex flex-col mb-5">
            <div className="flex mb-5 items-center">
              <FaRegUserCircle className={`text-[50px] -ml-1 mr-5 text-white self-start `}/>
              <p className="text-2xl">{userName}</p>
            </div>
    
              <div className="mb-5">
                都道府県：
                <p>{userPrefecture}</p>
              </div>
              <div className="mb-5">
                誕生日：
                <p>{userBirthday}</p>
              </div>
    
              <div className="mb-5">
                性別：
                <p>{userGender}</p>
              </div>
          </div>
        </div>
      }
    </>
    
  );
};

export default Profile;