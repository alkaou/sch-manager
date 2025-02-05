import React from 'react';

function TextInput() {
    return (
        <div className="flex flex-col-reverse max-w-xs w-full pt-4">
            <input
                placeholder="Email Address"
                className="peer outline-none ring px-3 py-2 h-10 border-0 rounded-md ring-gray-300 duration-300 focus:ring-2 focus:ring-blue-500 text-sm shadow-md focus:shadow-none placeholder:text-gray-400"
                type="text"
            />
            <span
                className="duration-300 opacity-0 mb-1 peer-focus:opacity-100 text-gray-500 text-xs -translate-y-10 peer-focus:translate-y-0"
            >
                Email Address
            </span>
        </div>
    );
};

export default TextInput;