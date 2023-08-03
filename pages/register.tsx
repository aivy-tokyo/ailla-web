import { prefectures } from "@/utils/constants";
import { Prefecture, UserGenderType, UserProfile } from "@/utils/types";
import { ChangeEvent, FormEvent, SetStateAction, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useRouter } from "next/router";


export default function Register(){
  const [userName, setUserName] = useState('');
  const [userPrefecture, setUserPrefecture] = useState<Prefecture>();
  const [userBirthday, setUserBirthday] = useState<string>('');
  const [userGender, setUserGender] = useState<UserGenderType>('選択しない');
  const [password, setPassword] = useState<string>('');
  const [isShowPassword, setIsShowPassword] = useState<boolean>(false);
  const [passwordConfirm, setPasswordConfirm] = useState<string>('');
  const router = useRouter();

  const handleSubmit = (event: FormEvent<HTMLFormElement> ) => {
    event.preventDefault();
    if(!userName || !userPrefecture || !userBirthday || !userGender || !password){
      console.log('userName',userName);
      console.log('userPrefecture',userPrefecture);
      console.log('userBirthday',userBirthday);
      console.log('password',password);
      alert('値のどれかが未入力です');
      return;
    };
    if(password !== passwordConfirm){
      alert('パスワードと確認用パスワードの文字が一致しません');
      return;
    };
    // alert('新規登録しました');
    fetch('/api/user',{
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        userPrefecture: userPrefecture,
        userBirthday: userBirthday,
        userGender: userGender,
        password: password,
      }),
    })
    .then(response => {
      console.log('response->',response);
      return response.json()
    })
    .then((data: UserProfile) => {
      console.log('data', data);
      setUserName(data.userName.S);
      setUserPrefecture(data.userPrefecture.S);
      setUserBirthday(data.userBirthday.S);
      setUserGender(data.userGender.S);

      router.push('/')
    })
    .catch((error) => console.error('Error:', error));
  };
  const handleSetPassword = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    console.log(e.target.value);
  };
  const handleSetPasswordConfirm = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordConfirm(e.target.value);
    console.log(e.target.value);
  };

  const passwordInput = (
    value: string, 
    setValue: (e: ChangeEvent<HTMLInputElement>) => void,
    setIsShowValue: (boolean:SetStateAction<boolean>) => void
  ) => {
    return (
      <div className="relative flex justify-end items-center mb-5">
        <input type={isShowPassword ? 'text' : 'password'} className="text-white rounded-md p-2 w-full" value={value} onChange={(e) => setValue(e)}/>
        {isShowPassword ? 
          <FaRegEyeSlash className="absolute  text-white text-[1.8rem] right-2" onClick={() => setIsShowValue(false)}/>
          :
          <FaRegEye className="absolute  text-white text-[1.8rem] right-2" onClick={() => setIsShowValue(true)}/>
        }
      </div>
    );
  };

  return (
    <div className="flex h-full text-black text-center">
      <div className="bg-stone-300 rounded-xl opacity-90 w-[500px] h-fit m-auto pt-5 flex flex-col items-center">
        <h2 className="text-2xl">新規登録</h2>
        <form onSubmit={handleSubmit} className="w-[80%] my-5">
          <div className="mb-5">
            <label htmlFor="">名前：</label>
            <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="rounded-md p-2 w-full text-white"/>
          </div>
  
          <div className="flex flex-col mb-5">
            <label>都道府県：</label>
            <select className="text-white rounded-md p-2 mb-5" value={userPrefecture} onChange={(e) => setUserPrefecture(e.target.value as Prefecture)}>
              <option value="" selected disabled>選択してください</option>
              {
                prefectures.map((prefecture,index)=> {
                  return (
                    <option key={index} value={prefecture}>{prefecture}</option>
                  );
                })
              }
            </select>
  
            <span>生年月日：</span>
            <input type="text" className="text-white rounded-md p-2 mb-5" value={userBirthday} onChange={(e) => setUserBirthday(String(e.target.value))}/>
  
            <label htmlFor="">性別：</label>
            <select name="" id="" value={userGender} className="text-white rounded-md p-2 mb-5" onChange={(e) => setUserGender(e.target.value as UserGenderType)}>
              <option value="男性">男性</option>
              <option value="女性">女性</option>
              <option value="選択しない">選択しない</option>
            </select>

            <label>パスワード：</label>
            {passwordInput(password, handleSetPassword, setIsShowPassword)}
            <label>パスワード(確認用)：</label>
            {passwordInput(passwordConfirm, handleSetPasswordConfirm, setIsShowPassword)}
          </div>

          <button type="submit" className="bg-sky-500 border border-sky-600 rounded-full text-white font-bold py-3 px-5">登録してはじめる</button>
        </form>
        </div>
    </div>
  );
};