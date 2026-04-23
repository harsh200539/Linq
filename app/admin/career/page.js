import JobManager from "../../../src/admin/JobManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="jobs">
      <JobManager />
    </PermissionGuard>
  );
}
