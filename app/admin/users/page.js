import UserManager from "../../../src/admin/UserManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="users">
      <UserManager />
    </PermissionGuard>
  );
}
