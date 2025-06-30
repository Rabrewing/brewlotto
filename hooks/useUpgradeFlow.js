import { createContext, useContext, useState } from "react";

const UpgradeFlowContext = createContext();

export function UpgradeFlowProvider({ children }) {
    const [pendingTier, setPendingTier] = useState(null);
    const clearPendingTier = () => setPendingTier(null);

    return (
        <UpgradeFlowContext.Provider value={{ pendingTier, setPendingTier, clearPendingTier }}>
            {children}
        </UpgradeFlowContext.Provider>
    );
}

export const useUpgradeFlow = () => useContext(UpgradeFlowContext);