import { HeaderLabel } from "./HeaderLabel";

type InputFieldProps = {
  label: string;
  children: React.ReactNode;
};

export const InputField: React.FC<InputFieldProps> = ({ label, children }) => {
  return (
    <div className="flex flex-col my-6">
      <label className="my-2">
        <HeaderLabel>{label}</HeaderLabel>
      </label>
      {children}
    </div>
  );
};