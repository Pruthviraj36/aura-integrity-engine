import React, { createContext, useContext, useState, type ReactNode } from "react";
import type { Role } from "@/lib/mock-data";

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType>({ role: "student", setRole: () => {} });

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>("student");
  return <RoleContext.Provider value={{ role, setRole }}>{children}</RoleContext.Provider>;
};

export const useRole = () => useContext(RoleContext);
