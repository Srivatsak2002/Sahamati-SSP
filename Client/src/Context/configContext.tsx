import React, { createContext, useContext } from "react";

interface ConfigContextProps {
  config: any;
}

const ConfigContext = createContext<ConfigContextProps | undefined>(undefined);

export const ConfigProvider: React.FC<{ config: any; children: React.ReactNode }> = ({ config, children }) => {
  return <ConfigContext.Provider value={{ config }}>{children}</ConfigContext.Provider>;
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("useConfig must be used within a ConfigProvider");
  }
  return context.config;
};
