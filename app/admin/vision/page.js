import VisionManager from "../../../src/admin/VisionManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="vision">
      <VisionManager />
    </PermissionGuard>
  );
}
