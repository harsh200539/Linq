import CareerGrowthManager from "../../../src/admin/CareerGrowthManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="growth">
      <CareerGrowthManager />
    </PermissionGuard>
  );
}
