import { FaRegUserCircle } from "react-icons/fa";
import { useResponsive } from "@/hooks/useResponsive";
import { useEffect, useState } from "react";
import { label } from "three/examples/jsm/nodes/Nodes.js";
import { Prefecture } from "@/utils/types";

type UserGenderType = '男性' | '女性' | '選択しない'
interface UserProfile  {
  userName: {S: string};
  userPrefecture: {S: Prefecture};
  userBirthday: {S: string};
  userGender: {S: UserGenderType};
}

const prefectures: Prefecture[] = [
  '北海道', '青森県', '岩手県', '宮城県', 
  '秋田県', '山形県', '福島県', '茨城県', 
  '栃木県', '群馬県', '埼玉県', '千葉県', 
  '東京都', '神奈川県', '新潟県', '富山県', 
  '石川県', '福井県', '山梨県', '長野県', 
  '岐阜県', '静岡県', '愛知県', '三重県', 
  '滋賀県', '京都府', '大阪府', '兵庫県', 
  '奈良県', '和歌山県', '鳥取県', '島根県', 
  '岡山県', '広島県', '山口県', '徳島県', 
  '香川県', '愛媛県', '高知県', '福岡県', 
  '佐賀県', '長崎県', '熊本県', '大分県', 
  '宮崎県', '鹿児島県', '沖縄県'
];


const Profile = () => {
  const { isDeskTop } = useResponsive()
  const [isEditMode,setIsEditMode] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>('');
  const [userPrefecture, setUserPrefecture] = useState<Prefecture>();
  const [userBirthday, setUserBirthday] = useState<string>('');
  const [userGender, setUserGender] = useState<UserGenderType>('選択しない');
  const [userId, setUserId] = useState<string>('97004af5-b779-48c3-be71-44d8983a675d');


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
      <div className='bg-stone-300 w-20 text-black text-center rounded-md cursor-pointer' onClick={() => setIsEditMode(true)}>編集する</div>
    </div>
  );
};

export default Profile;