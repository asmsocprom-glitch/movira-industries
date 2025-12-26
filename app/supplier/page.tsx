import { SignOutButton } from "@clerk/nextjs";

const Supplier = () => {
    return ( 
        <>This is supplier
        
        <SignOutButton>
            <button className="px-6 py-3 rounded-xl bg-black text-white">
            Sign out
            </button>
        </SignOutButton>
    
        </> 
    );
}
 
export default Supplier;