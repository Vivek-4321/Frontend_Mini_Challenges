import React, { useState, useRef, useEffect } from "react";
import { FaCheckCircle } from "react-icons/fa";

interface OTPInputProps {
  length: number;
  onComplete: (otp: string) => void;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, onComplete }) => {
  const [otp, setOTP] = useState<string[]>(Array(length).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;

    const newOTP = [...otp];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value !== "" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newOTP.every((digit) => digit !== "")) {
      onComplete(newOTP.join(""));
      setIsVerified(true);
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").slice(0, length);
    const newOTP = [...otp];
    for (let i = 0; i < pastedData.length; i++) {
      if (!isNaN(Number(pastedData[i]))) {
        newOTP[i] = pastedData[i];
      }
    }
    setOTP(newOTP);
    inputRefs.current[Math.min(pastedData.length, length - 1)]?.focus();
  };

  return (
    <div className="otp-container">
      <div className="otp-wrapper">
        {otp.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            className={`otp-input ${digit !== "" ? "filled" : ""}`}
          />
        ))}
      </div>
      {isVerified && (
        <div className="verification-message">
          <FaCheckCircle className="check-icon" />
          <span>OTP Verified</span>
        </div>
      )}
      <style>{`
        .otp-container {
          display: flex;
          flex-direction: column;
          gap: 10px;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 90vh;
          background-color: var(--color-primary);
          overflow: hidden;
          
        }

        .otp-wrapper {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        }

        .otp-input {
          width: 70px;
          height: 70px;
          font-size: 24px;
          text-align: center;
          border: 3px solid var(--color-dark);
          border-radius: 8px;
          transition: all 0.3s ease;
          outline: none;
          background: linear-gradient(145deg, #0d0e0d, #0f100f);
box-shadow:  6px 6px 12px #060606,
             -6px -6px 12px #161816;
           color: var(--color-light);
          
        }
        .otp-input:focus {
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
        }
        .otp-input.filled {
          background-color: #e6f3ff;
          border-color: #007bff;
        }
        .verification-message {
        margin-top: 2rem;
          display: flex;
          align-items: center;
          margin-left: 10px;
          color: #28a745;
          font-weight: bold;
          animation: fadeIn 0.5s ease-in-out;
        }
        .check-icon {
          margin-right: 5px;
          animation: scaleIn 0.5s ease-in-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
      `}</style>
    </div>
  );
};

export default OTPInput;
