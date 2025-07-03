import React from 'react';

const PageLoading = () => {
  return (
    <div 
      className="items-center absolute z-40 justify-center"
      style={{
        top: "50%",
        left: "50%",
      }}
    >
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default PageLoading;