import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { format, addMonths, subMonths, addYears, subYears, startOfMonth, endOfMonth, startOfWeek, addDays, isSameDay } from "date-fns";
import { useTheme, useLanguage } from './contexts.js';

const AdvancedCalendar = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const today = new Date();

  const { app_bg_color, text_color, theme } = useTheme();
  const { live_language } = useLanguage();

  const week_days = live_language.week_days_name_array;

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);

  const days = [];
  let day = startDate;

  while (day <= monthEnd || days.length < 42) {
    days.push(day);
    day = addDays(day, 1);
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className={`
          bg-white p-6 rounded-lg shadow-xl w-96 animate-slideIn
          ${theme === "light" ? "text-gray-600" : app_bg_color}
          ${theme === "dark" ? text_color : ""}
      `}>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">{format(currentDate, "MMMM yyyy")}</h2>
          <button onClick={onClose} className="text-red-500">
            <FaTimes size={24} />
          </button>
        </div>

        <div className="flex justify-between mb-2">
          <button onClick={() => setCurrentDate(subYears(currentDate, 1))} className="text-gray-500">
            <FaChevronLeft size={20} />
          </button>
          <span className="text-xl">{format(currentDate, "yyyy")}</span>
          <button onClick={() => setCurrentDate(addYears(currentDate, 1))} className="text-gray-500">
            <FaChevronRight size={20} />
          </button>
        </div>

        <div className="flex justify-between">
          <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="text-gray-500">
            <FaChevronLeft size={20} />
          </button>
          <span className="text-xl">{format(currentDate, "MMMM")}</span>
          <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="text-gray-500">
            <FaChevronRight size={20} />
          </button>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-2 text-center">
          {week_days.map((day) => (
            <span key={day} className="font-semibold">{day}</span>
          ))}
          {days.map((day, index) => (
            <button
              key={index}
              className={`p-2 rounded-full w-10 h-10 flex items-center justify-center transition ${
                isSameDay(day, today) ? "bg-green-500 text-white" : "hover:bg-gray-200 text-gray-600"
              }`}
            >
              {format(day, "d")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalendar;
