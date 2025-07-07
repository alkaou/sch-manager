import React from "react";

export default function NoteWriter({
  dropdownRef,
  dropdownBgColor,
  tableBorderColor,
  hoverNumber,
  setActiveCell,
  student,
  subject,
  updateNote,
  Compo_or_Class = "composition",
  handleWholeNumberSelect,
  handleDecimalSelect,
  wholeNumberOptions,
  decimalOptions,
  translate,
  language,
}) {
  return (
    <>
      <div
        ref={dropdownRef}
        className={`mt-1 py-1 rounded-md shadow-lg ${dropdownBgColor} border-4 border-indigo-500 ${tableBorderColor}`}
        style={{
          minWidth: "300px",
          position: "fixed",
          top: "65%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 1000,
        }}
      >
        <div className="p-2">
          <div className="mb-2">
            <button
              onClick={() => {
                updateNote(student.id, subject.name, Compo_or_Class, null);
                setActiveCell(null);
              }}
              className={`w-full px-2 py-1 text-center rounded bg-blue-300 ${hoverNumber}`}
            >
              {translate("delete_1", language)}
            </button>
          </div>
          <div className="mb-2">
            <p className="`w-full px-2 py-1 text-center">
              {`${student.first_name} ${student.sure_name} ${
                student.last_name
              } - ${
                Compo_or_Class === "composition" ? "M.Comp" : "M.Class"
              } - ${subject.name}`}
            </p>
          </div>
          <div className="grid grid-cols-5 gap-1 mb-2">
            {wholeNumberOptions.map((num) => (
              <button
                key={num}
                onClick={() =>
                  handleWholeNumberSelect(
                    student.id,
                    subject.name,
                    Compo_or_Class,
                    num
                  )
                }
                className={`px-2 py-1 text-center rounded ${hoverNumber}`}
              >
                {num}
              </button>
            ))}
          </div>
          {student?.notes[subject.name]?.[Compo_or_Class] === 20 ? null : (
            <div className="grid grid-cols-4 gap-1">
              {decimalOptions.map((decimal) => (
                <button
                  key={decimal}
                  onClick={() =>
                    handleDecimalSelect(
                      student.id,
                      subject.name,
                      Compo_or_Class,
                      decimal
                    )
                  }
                  className={`px-2 py-1 text-center rounded ${hoverNumber}`}
                >
                  0.{decimal}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
