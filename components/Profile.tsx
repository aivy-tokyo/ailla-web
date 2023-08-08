import { FaRegUserCircle } from "react-icons/fa";
import { Prefecture, UserGenderType } from "@/utils/types";
import { prefectures } from "@/utils/constants";
import { useProfile } from "@/hooks/useProfile";

const Profile = () => {
  const {
    editProfile,
    
    userName,setUserName, 
    userPrefecture,setUserPrefecture, 
    userBirthday,setUserBirthday, 
    userGender,setUserGender,

    isEditMode, setIsEditMode,

  } = useProfile();

  const handleSubmit = (e:any) => {
    e.preventDefault();
    editProfile();
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