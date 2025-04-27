import { entity } from "@/dataTypes/transcribeDataTypes";
import { formatTime } from "@/lib/formatDate";
import React from "react";

type EntitiesProps = {
  entities: entity[];
};

const Entities: React.FC<EntitiesProps> = ({ entities }) => {
  if (!entities || entities.length === 0) return null;

  return (
    <div className="max-w-5xl mt-10">
      <h2 className="text-2xl font-semibold mb-4">📝 Entities</h2>
      <div className="space-y-6 max-h-[500px] overflow-y-auto pr-3">
        {entities.map((item, index) => (
          <div key={index} className="border-l-4 border-blue-500 pl-4">
            <div className="flex justify-between items-center mb-1">
              <span className="font-bold text-lg text-blue-700">
                {item.entity_type}
              </span>
              <span className="text-sm text-gray-500">
              🕒 {item.start !== undefined ? formatTime(item.start) : 'N/A'} - {item.end !== undefined ? formatTime(item.end) : 'N/A'}
              </span>
            </div>
            <p className="text-base leading-relaxed whitespace-pre-wrap">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Entities;
