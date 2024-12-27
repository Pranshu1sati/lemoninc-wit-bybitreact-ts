import React, { useState } from "react";
// import { UseFormRegister } from "react-hook-form";
// import { Product } from "../types";

interface TagInputProps {
  // inputValue: string;
  // setInputValue: (newValue: string) => void;
  values: string[];
  setValues: (newValues: string[]) => void;
  error: boolean;
  // addTags: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  // removeTags: (valueIndex: number) => void;
  // register: UseFormRegister<Product>;
  // name: string;
  // index: number;
}

const TagInput: React.FC<TagInputProps> = ({
  // inputValue,
  // setInputValue,
  values,
  setValues,
  error,
  // addTags,
  // removeTags,
  // register,
  // name,
  // index,
}) => {
  // console.log(values, "hehe");
  const [inputValue, setInputValue] = useState<string>("");
  const addTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault();
      setValues([...values, inputValue.trim()]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    setValues(values.filter((_, i) => i !== index));
  };
  return (
    <div className="w-auto h-full flex items-center">
      <div className="w-auto flex-wrap">
        {/* Render tags */}
        <div
          className={`max-w-[190px] sm:max-w-[350px] md:max-w-[383.85px] p-2 rounded-lg flex flex-row border ${
            error ? "border-red-500" : "border-gray-300"
          }`}
        >
          <div className="flex w-1/3 max-w-2/3 overflow-x-scroll no-scrollbar  gap-x-1">
            {values.map((value, valueIndex) => (
              <button
                key={valueIndex}
                className="rounded-md text-sm bg-gray-200 border-none outline-none mx-1 px-2  flex items-center"
              >
                <p className="whitespace-nowrap">{value}</p>
                <span
                  className="rounded-md cursor-pointer text-black hover:text-red-500 ml-2"
                  onClick={() => removeTag(valueIndex)}
                >
                  &times;
                </span>
              </button>
            ))}
          </div>

          {/* Input for adding tags */}
          <input
            className=" border-none rounded-md h-full min-w-1/3 w-2/3 focus:ring-2   bg-gray-200"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={addTag}
            // placeholder="Add a tag and press Enter"
            // {...register(`variants.${index}.${name}.${index}`, {
            //   required: true,
            // })}
          />
        </div>
      </div>
    </div>
  );
};

export default TagInput;
