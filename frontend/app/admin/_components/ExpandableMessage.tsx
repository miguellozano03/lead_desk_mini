"use client";
import { useState } from "react";

export const ExpandableMessage = ({ message }: { message: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const isLongText = message.length > 60;

  return (
    <div className="max-w-xs">
      <p
        className={`text-gray-600 transition-all ${!isExpanded ? "line-clamp-2" : "wrap-break-words"}`}
      >
        {message}
      </p>
      {isLongText && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-blue-600 hover:underline mt-1 focus:outline-none"
        >
          {isExpanded ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};
