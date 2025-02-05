import React from 'react';

function TextInput({ name, value, setValue, type = "text", textColor="text-gray-800"}) {
    return (
        <div className="flex flex-col-reverse max-w-xs w-full pt-4">
            <input
                placeholder={name}
                className={`${textColor} text-bold peer outline-none ring px-4 py-3 h-12 border-0 rounded-lg ring-gray-300 duration-300 focus:ring-2 focus:ring-blue-500 text-base font-medium shadow-md focus:shadow-none placeholder-gray-400 placeholder:text-sm`}
                type={type}
                value={value}
                onChange={(e) => setValue(e)}
            />
            <span
                className="duration-300 opacity-0 mb-1 peer-focus:opacity-100 text-white-300 text-xs -translate-y-10 peer-focus:translate-y-0"
            >
                {name}
            </span>
        </div>
    );
};

export default TextInput;