
import { createContext, useContext, ReactNode } from 'react';
import { useSettingsSync as useSettingsSyncHook } from '@/hooks/use-settings-sync';

interface SettingsSyncContextType {
  refreshPrivacySettings: () => void;
  refreshNotificationSettings: () => void;
}

const SettingsSyncContext = createContext<SettingsSyncContextType>({
  refreshPrivacySettings: () => {},
  refreshNotificationSettings: () => {},
});

export const useSettingsSync = () => useContext(SettingsSyncContext);

interface SettingsSyncProviderProps {
  children: ReactNode;
  onPrivacyUpdate: () => void;
  onNotificationUpdate: () => void;
}

export const SettingsSyncProvider = ({
  children,
  onPrivacyUpdate,
  onNotificationUpdate
}: SettingsSyncProviderProps) => {
  useSettingsSyncHook(onPrivacyUpdate, onNotificationUpdate);

  return (
    <SettingsSyncContext.Provider 
      value={{
        refreshPrivacySettings: onPrivacyUpdate,
        refreshNotificationSettings: onNotificationUpdate
      }}
    >
      {children}
    </SettingsSyncContext.Provider>
  );
};
