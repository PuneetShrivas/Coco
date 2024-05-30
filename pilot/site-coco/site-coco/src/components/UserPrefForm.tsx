"use client";
import React, { useState } from 'react';
import { KindeUser } from '@kinde-oss/kinde-auth-nextjs/types';
import { v4 as uuidv4 } from 'uuid'; 
const UserPrefForm: React.FC<{ user: KindeUser | null; isAuth: boolean }> = ({ user, isAuth }) => {
  const [formData, setFormData] = useState({
    dislikes: {}, 
    likes: {},
  });

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = event.target;

    try {
      setFormData({ ...formData, [name]: JSON.parse(value) });
    } catch (error) {
      console.error("Invalid JSON format:", error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isAuth || !user) {
      alert("Please log in to save your preferences.");
      return;
    }

    try {
      const uniqueId = uuidv4()
      const response = await fetch('/api/user/preferences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id: uniqueId, ...formData}), 
      });

      if (response.ok) {
        alert("Preferences saved successfully!");
      } else {
        const errorData = await response.json();
        alert(`Error saving preferences: ${errorData.error}`);
      }
    } catch (error) {
      alert(`Error saving preferences: ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 mt-20">

      <div>
        <label htmlFor="likes" className="block text-sm font-medium text-gray-700">
          Likes (JSON Format):
        </label>
        <textarea
          id="likes"
          name="likes"
          value={JSON.stringify(formData.likes, null, 2)} 
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <div>
        <label htmlFor="dislikes" className="block text-sm font-medium text-gray-700">
          Dislikes (JSON Format):
        </label>
        <textarea
          id="dislikes"
          name="dislikes"
          value={JSON.stringify(formData.dislikes, null, 2)} 
          onChange={handleChange}
          className="mt-1 p-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>

      <button
        type="submit"
        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Save Preferences
      </button>
    </form>
  );
};

export default UserPrefForm;
