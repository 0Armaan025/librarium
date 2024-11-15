import React from "react";

type PasswordInputProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

const PasswordInput = ({ value, onChange }: PasswordInputProps) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative w-[88%] ml-4 mr-4 mt-2">
      <input
        type={showPassword ? "text" : "password"}
        className="px-4 p-2 text-md bg-[#e4c8ab] text-black w-full placeholder-gray-800 rounded-md focus:outline-none focus:ring-2 focus:ring-[#000000] focus:ring-opacity-100"
        placeholder="Password"
        value={value}
        onChange={onChange}
        style={{ fontFamily: "Poppins, sans-serif" }}
      />
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute inset-y-0 right-2 flex items-center text-gray-800 hover:text-black focus:outline-none"
      >
        {showPassword ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0zm-6.5 0a7.477 7.477 0 011.5-4.5m4.5 0a7.477 7.477 0 011.5 4.5m-6 0a7.477 7.477 0 00-1.5 4.5m4.5 0a7.477 7.477 0 001.5-4.5M21 12c0 3.866-5.373 7-12 7S-3 15.866-3 12 1.627 5 12 5s12 3.134 12 7z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.98 8.223C4.996 6.54 6.345 5.281 8 4.488 10.16 3.326 12.842 3 16.5 3c.892 0 1.768.058 2.617.17M9.873 14.413a4.997 4.997 0 001.872.392 5.002 5.002 0 004.165-7.662m-1.634 5.963a5.002 5.002 0 00-4.16-7.665m4.164 7.665a7.484 7.484 0 01-6.214 3.659 7.484 7.484 0 01-6.214-3.659M16.5 3a7.48 7.48 0 00-4.6 1.2m-.855 12.815a5.002 5.002 0 006.702 0"
            />
          </svg>
        )}
      </button>
    </div>
  );
};

export default PasswordInput;
