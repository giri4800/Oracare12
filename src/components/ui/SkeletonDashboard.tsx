import React from 'react';
import Skeleton from './Skeleton';

const SkeletonDashboard = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <Skeleton className="w-48 h-8 mb-4" variant="text" />
        <Skeleton className="w-96 h-4" variant="text" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
            <Skeleton className="w-16 h-16 mb-4" variant="circular" />
            <Skeleton className="w-24 h-4 mb-2" variant="text" />
            <Skeleton className="w-32 h-3" variant="text" />
          </div>
        ))}
      </div>

      {/* Recent Analysis Grid */}
      <div className="mb-8">
        <Skeleton className="w-48 h-6 mb-6" variant="text" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
              <Skeleton className="w-full h-48" /> {/* Image placeholder */}
              <div className="p-4">
                <Skeleton className="w-3/4 h-4 mb-2" variant="text" />
                <Skeleton className="w-1/2 h-3" variant="text" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Section */}
      <div>
        <Skeleton className="w-48 h-6 mb-6" variant="text" />
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <Skeleton className="w-12 h-12" variant="circular" />
              <div className="flex-1">
                <Skeleton className="w-3/4 h-4 mb-2" variant="text" />
                <Skeleton className="w-1/2 h-3" variant="text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SkeletonDashboard;
