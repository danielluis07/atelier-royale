import { requireAdmin } from "@/lib/auth-utils";

const AdminPage = async () => {
  await requireAdmin();

  return (
    <div>
      <p>Admin Page</p>
    </div>
  );
};

export default AdminPage;
