import React, { createContext, useContext, useState, ReactNode } from 'react';

// --- Context ---
interface TabsContextType {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

// --- Parent Component ---
interface TabsProps {
  defaultTab: string;
  children: ReactNode;
}

export const Tabs = ({ defaultTab, children }: TabsProps) => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="tabs-container">{children}</div>
    </TabsContext.Provider>
  );
};

// --- Child Component: List ---
Tabs.List = ({ children }: { children: ReactNode }) => {
  return <div className="tabs-list">{children}</div>;
};

// --- Child Component: Tab ---
interface TabProps {
  id: string;
  children: ReactNode;
}

Tabs.Tab = ({ id, children }: TabProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Tab must be used within Tabs');

  const isActive = context.activeTab === id;

  return (
    <button
      className={`tab-btn ${isActive ? 'active' : ''}`}
      onClick={() => context.setActiveTab(id)}
    >
      {children}
    </button>
  );
};

// --- Child Component: Panels ---
Tabs.Panels = ({ children }: { children: ReactNode }) => {
  return <div className="tabs-panels">{children}</div>;
};

// --- Child Component: Panel ---
interface PanelProps {
  id: string;
  children: ReactNode;
}

Tabs.Panel = ({ id, children }: PanelProps) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error('Tabs.Panel must be used within Tabs');

  if (context.activeTab !== id) return null;

  return <div className="tab-panel">{children}</div>;
};
