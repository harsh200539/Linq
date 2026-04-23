import TimelineManager from "../../../src/admin/TimelineManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="timeline">
      <TimelineManager />
    </PermissionGuard>
  );
}
