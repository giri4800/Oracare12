import React from 'react';
import { useTheme } from '../Theme/useTheme';
import { useAuthStore } from '../../stores/useAuthStore';
import { Sun, Moon, Bell, Shield, Key, User } from 'lucide-react';

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuthStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Settings</h1>
          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
            Manage your account settings and preferences.
          </p>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              Profile Information
            </h2>
            <div className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    value={user?.email}
                    disabled
                    className="block w-full rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              {theme === 'dark' ? (
                <Moon className="h-5 w-5 mr-2 text-gray-500" />
              ) : (
                <Sun className="h-5 w-5 mr-2 text-gray-500" />
              )}
              Appearance
            </h2>
            <div className="mt-6">
              <div className="flex items-center justify-between">
                <span className="flex flex-grow flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Dark Mode</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Use dark theme for better visibility in low light
                  </span>
                </span>
                <button
                  onClick={toggleTheme}
                  type="button"
                  className={`${
                    theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
                  } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                >
                  <span
                    className={`${
                      theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                    } pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
                  >
                    <span
                      className={`${
                        theme === 'dark' ? 'opacity-0 duration-100 ease-out' : 'opacity-100 duration-200 ease-in'
                      } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                    >
                      <Sun className="h-3 w-3 text-gray-400" />
                    </span>
                    <span
                      className={`${
                        theme === 'dark' ? 'opacity-100 duration-200 ease-in' : 'opacity-0 duration-100 ease-out'
                      } absolute inset-0 flex h-full w-full items-center justify-center transition-opacity`}
                    >
                      <Moon className="h-3 w-3 text-gray-600" />
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Bell className="h-5 w-5 mr-2 text-gray-500" />
              Notifications
            </h2>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="flex flex-grow flex-col">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Email Notifications</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Receive email updates about your analyses
                  </span>
                </span>
                <button
                  type="button"
                  className="bg-gray-200 relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <span className="translate-x-0 pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="bg-white dark:bg-gray-800 shadow-lg rounded-xl overflow-hidden">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
              <Shield className="h-5 w-5 mr-2 text-gray-500" />
              Security
            </h2>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Key className="h-4 w-4 mr-2" />
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
