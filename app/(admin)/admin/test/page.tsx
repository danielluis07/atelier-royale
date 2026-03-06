import { requireAdmin } from "@/lib/auth-utils";

const TestPage = async () => {
  await requireAdmin();

  return (
    <div>
      <h1>Test Page</h1>
    </div>
  );
};

export default TestPage;
