import GalleryManager from "../../../src/admin/GalleryManager";
import PermissionGuard from "../../../src/admin/components/PermissionGuard";

export default function Page() {
  return (
    <PermissionGuard moduleId="gallery">
      <GalleryManager />
    </PermissionGuard>
  );
}
