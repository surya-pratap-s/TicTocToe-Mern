import React from "react";

export default function Loading() {
  return (
    <div className="w-full flex items-center justify-center py-12">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-slate-300 border-t-slate-700 dark:border-t-slate-200" />
    </div>
  );
}
