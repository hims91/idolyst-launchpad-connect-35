
import React from 'react';
import * as LucideIcons from 'lucide-react';

export function useIconByName(name: string) {
  const IconComponent = React.useMemo(() => {
    if (!name) return null;
    
    // Convert kebab-case or snake_case to camelCase
    const formattedName = name
      .replace(/[-_]([a-z])/g, (_, letter) => letter.toUpperCase())
      .replace(/^[a-z]/, letter => letter.toUpperCase());
    
    return (LucideIcons as any)[formattedName] as React.FC<{ className?: string }>;
  }, [name]);
  
  return IconComponent;
}
