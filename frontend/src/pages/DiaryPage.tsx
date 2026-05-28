import React, { useState } from "react";
import { Sidebar } from "@/widgets/Sidebar/ui/Sidebar";
import { DiaryPanel } from "@/widgets/DiaryPanel/ui/DiaryPanel";

export const DiaryPage: React.FC = () => {
  const [sidebarWidth, setSidebarWidth] = useState(260);

  return (
    <div className="h-screen flex bg-background text-on-surface overflow-hidden relative">
      {/* Sidebar */}
      <div
        className="flex shrink-0 h-full relative"
        style={{ width: sidebarWidth }}
      >
        <Sidebar onDiaryClick={() => {}} />
      </div>

      {/* Main Content Area containing the Diary */}
      <div className="flex-1 h-full bg-surface-container-low overflow-hidden">
        <div className="max-w-[1000px] mx-auto h-full flex flex-col">
          <div className="flex-1 overflow-y-auto">
            <DiaryPanel
              isOpen={true}
              width={1000}
              onClose={() => {}}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiaryPage;
