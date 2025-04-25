import React, { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

interface CardDataStatsProps {
  title: string;
  total: string;
  rate: string;
  levelUp?: boolean;
  levelDown?: boolean;
  children: ReactNode;
}

const CardDataStats: React.FC<CardDataStatsProps> = ({
  title,
  total,
  rate,
  levelUp,
  levelDown,
  children,
}) => {
  return (
    <div className="rounded-lg border border-stroke bg-white py-6 px-6 shadow-md transition-all hover:shadow-lg dark:border-strokedark dark:bg-boxdark">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/30">
        {children}
      </div>

      <div className="mt-4 flex items-end justify-between">
        <div>
          <h4 className="text-2xl font-bold text-black dark:text-white">
            {total}
          </h4>
          <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
        </div>

        <span
          className={`flex items-center gap-1 text-sm font-medium ${
            levelUp ? 'text-green-500' : ''
          } ${levelDown ? 'text-red-500' : ''}`}
        >
          {rate}
          
          {levelUp && (
            <ArrowUp size={16} className="text-green-500" />
          )}
          
          {levelDown && (
            <ArrowDown size={16} className="text-red-500" />
          )}
        </span>
      </div>
    </div>
  );
};

export default CardDataStats;