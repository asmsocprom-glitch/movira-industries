import { SignOutButton } from "@clerk/nextjs";

const Admin = () => {
  return (
    <>
      <p>This is admin</p>
      <SignOutButton>
        <button className="px-6 py-3 rounded-xl bg-black text-white">
          Sign out
        </button>
      </SignOutButton>
    </>
  );
};

export default Admin;
