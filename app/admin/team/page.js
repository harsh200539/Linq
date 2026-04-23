import TeamManager from "../../../src/admin/TeamManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="team">
      <TeamManager />
    </PermissionGuard>
  );
}
