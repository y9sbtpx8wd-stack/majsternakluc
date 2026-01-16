'use client';

import { useRole } from './useRole';

export function usePermission() {
  const { role } = useRole();

  const can = (permission: string) => {
    if (!role) return false;

    const rules: Record<string, string[]> = {
      'delete_user': ['SUPERADMIN'],
      'edit_user': ['ADMIN', 'SUPERADMIN'],
      'view_logs': ['SUPERADMIN'],
      'manage_invoices': ['ADMIN', 'SUPERADMIN'],
      'view_dashboard': ['ADMIN', 'SUPERADMIN'],
    };

    return rules[permission]?.includes(role) ?? false;
  };

  return { can };
}
