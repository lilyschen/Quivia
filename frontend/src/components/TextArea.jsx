import React from 'react';

const TextArea = ({ value, onChange, placeholder }) => {
  return (
    <div className="input-box">
      <textarea
        rows="10"
        cols="40"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ boxShadow: 'none' }}
      ></textarea>
    </div>
  );
};

export default TextArea;
