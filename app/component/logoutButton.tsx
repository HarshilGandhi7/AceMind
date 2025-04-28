"use client";
import React, { MouseEvent, useState } from "react";
import { SignOut } from "@/lib/actions/auth.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);

  async function handleLogout() {
    setShowModal(false);
    const result = await SignOut();
    if (result?.success) {
      toast.success("Signed out successfully");
      router.push("/sign-in");
    } else {
      toast.error("Error signing out");
    }
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="bg-rose-600/20 hover:bg-rose-600/40 text-white font-medium py-1.5 px-4 rounded-md transition-colors duration-300"
      >
        Logout
      </button>

      {showModal && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-gray-900/80 rounded-lg shadow-md max-w-md w-full p-5"
            onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
          >
            <h2 className="text-lg font-semibold text-white mb-3">
              Confirm Logout
            </h2>
            <p className="text-gray-300 mb-5">
              Are you sure you want to log out of your account?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-700 text-gray-300 rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}