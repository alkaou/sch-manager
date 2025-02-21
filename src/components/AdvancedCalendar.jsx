import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight, FaTimes } from "react-icons/fa";
import { format, addMonths, subMonths, addYears, subYears } from "date-fns";

const AdvancedCalendar = ({ onClose }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-96 animate-slideIn">
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
          {["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"].map((day) => (
            <span key={day} className="font-semibold">{day}</span>
          ))}
          {Array.from({ length: 35 }, (_, i) => (
            <button key={i} className="p-2 rounded hover:bg-gray-200 transition">
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedCalendar;
