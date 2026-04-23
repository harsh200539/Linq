import TestimonialManager from "../../../src/admin/TestimonialManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="testimonials">
      <TestimonialManager />
    </PermissionGuard>
  );
}
