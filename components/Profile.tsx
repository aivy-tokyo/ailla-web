const Profile = () => {
  return (
    <>
      <div className="flex mb-3">
        <img src="myIcon.png" alt="" className="h-14 -ml-1 mr-5"/>
        <div>
          <p>Taro</p>
          <p>サンプル株式会社</p>
        </div>
      </div>
      <p>sample@sample.com</p>
      <p>090-0000-9999</p>
      <p>東京都港区愛宕2-5-1</p>
      <p>1991年1月1日</p>
      <p>男性</p>
    </>
  );
};

export default Profile;