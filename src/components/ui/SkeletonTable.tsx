import React from 'react';
import Skeleton from './Skeleton';

const SkeletonTable = () => {
  return (
    <div className="overflow-x-auto">
      <div className="inline-block min-w-full align-middle">
        <div className="overflow-hidden shadow-sm ring-1 ring-black ring-opacity-5">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th scope="col" className="px-6 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Skeleton className="h-4 w-32" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Skeleton className="h-4 w-28" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th scope="col" className="px-6 py-3">
                  <Skeleton className="h-4 w-20" />
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-900">
              {[...Array(8)].map((_, index) => (
                <tr key={index}>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-48" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-40" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SkeletonTable;
