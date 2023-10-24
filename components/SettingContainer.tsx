import React, { useState } from "react";
import { FaRegTimesCircle } from "react-icons/fa";
import { UserInfoEdit } from "./UserInfoEdit";
import { UserInfoDisplay } from "./UserInfoDisplay";

interface SettingContainerProps {
  onClose: () => void;
}

export const SettingContainer: React.FC<SettingContainerProps> = ({
  onClose,
}) => {
  const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const [isSendingRequest, setIsSendingRequest] = useState(false);
  const [isResultError, setIsResultError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  return (
    <div className="w-screen h-screen bg-gradient-user-info z-30 top-0 fixed overflow-y-scroll">
      <div className="flex justify-center">
        <div className="flex flex-col items-center w-[300px] py-10">
          {/* ユーザー情報表示・更新UI */}
          <div className="w-full pb-3 border-b-2">
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
                <UserInfoDisplay
                  onClose={onClose}
                  setIsEditMode={setIsEditMode}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
