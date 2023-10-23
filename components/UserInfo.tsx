
import { useState } from "react";
import { FaRegTimesCircle } from "react-icons/fa";
import { UserInfoEdit } from "./UserInfoEdit";
import { UserInfoDisplay } from "./UserInfoDisplay";

const UserInfo = ({ onClose }: { onClose: () => void }) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isResultError, setIsResultError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <div className="w-full">
      {isSendingRequest && (
        <button className="btn fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <span className="loading loading-spinner"></span>
          登録中...
        </button>
      )}
      {isResultError && (
        <div className="alert alert-error fixed top-2 left-1/2 w-[40vw] transform -translate-x-1/2">
          <FaRegTimesCircle className="text-black text-[34px] " />
          <span>{errorMessage}</span>
        </div>
      )}
      {isEditMode ? (
        <UserInfoEdit
          setIsEditMode={setIsEditMode}
          setIsSendingRequest={setIsSendingRequest}
          setIsResultError={setIsResultError}
          setErrorMessage={setErrorMessage}
        />
      ) : (
          <UserInfoDisplay onClose={onClose} setIsEditMode={setIsEditMode} />
      )}
    </div>
  );
};

export default UserInfo;
