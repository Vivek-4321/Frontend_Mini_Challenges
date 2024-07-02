import React, { useState, useEffect } from "react";
import { FaCopy, FaRedo, FaCheck } from "react-icons/fa";
import "./PasswordGenerator.css";

const PasswordGenerator: React.FC = () => {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [copied, setCopied] = useState(false);

  const generatePassword = () => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+{}[]|:;<>,.?/~";

    let newPassword = "";
    for (let i = 0; i < length; i++) {
      newPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setPassword(newPassword);
  };

  useEffect(() => {
    generatePassword();
  }, [
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols,
  ]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="password-generator">
      <h1 className="password-generator__title">Password Generator</h1>
      <div className="password-generator-wrapper">
        <div className="password-generator__display">
          <input
            className="password-generator__input"
            type="text"
            value={password}
            readOnly
          />
          <button
            onClick={copyToClipboard}
            className="password-generator__copy-btn"
          >
            {copied ? <FaCheck /> : <FaCopy />}
          </button>
        </div>
        <div className="password-generator__options">
          <div className="password-generator__option">
            <label className="password-generator__label" htmlFor="length">
              Length: {length}
            </label>
            <input
              className="password-generator__range"
              type="range"
              id="length"
              min="8"
              max="32"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value))}
            />
          </div>
          <div className="password-generator__option">
            <input
              className="password-generator__checkbox"
              type="checkbox"
              id="uppercase"
              checked={includeUppercase}
              onChange={(e) => setIncludeUppercase(e.target.checked)}
            />
            <label className="password-generator__label" htmlFor="uppercase">
              Include Uppercase
            </label>
          </div>
          <div className="password-generator__option">
            <input
              className="password-generator__checkbox"
              type="checkbox"
              id="lowercase"
              checked={includeLowercase}
              onChange={(e) => setIncludeLowercase(e.target.checked)}
            />
            <label className="password-generator__label" htmlFor="lowercase">
              Include Lowercase
            </label>
          </div>
          <div className="password-generator__option">
            <input
              className="password-generator__checkbox"
              type="checkbox"
              id="numbers"
              checked={includeNumbers}
              onChange={(e) => setIncludeNumbers(e.target.checked)}
            />
            <label className="password-generator__label" htmlFor="numbers">
              Include Numbers
            </label>
          </div>
          <div className="password-generator__option">
            <input
              className="password-generator__checkbox"
              type="checkbox"
              id="symbols"
              checked={includeSymbols}
              onChange={(e) => setIncludeSymbols(e.target.checked)}
            />
            <label className="password-generator__label" htmlFor="symbols">
              Include Symbols
            </label>
          </div>
        </div>
        <button
          onClick={generatePassword}
          className="password-generator__generate-btn"
        >
          <FaRedo /> Generate New Password
        </button>
      </div>
    </div>
  );
};

export default PasswordGenerator;
