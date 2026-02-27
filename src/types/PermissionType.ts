export default interface PermissionType {
  name: string;
  label: string;
  description: string;
  groupId: number;
}

export interface PermissionGroupType {
  name: string;
  label: string;
  description: string;
  sort_order?: number;
}
