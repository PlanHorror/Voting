import Link from "next/link";

export default function NavBar() {
  return (
    <div className="w-full mb-20">
      <nav className="flex items-center justify-between px-4 py-2 bg-white shadow-md">
        <div className="w-1/4 p-5">
          <h1 className="text-2xl font-bold text-indigo-500">Voting System</h1>
        </div>
        <div className="w-1/2 space-x-15 flex justify-center text-lg font-semibold">
          <Link href="/" className="text-indigo-500 hover:text-blue-500">
            Home
          </Link>
          <Link href="/votes" className="text-gray-900 hover:text-blue-500">
            List votes
          </Link>
          <Link href="/voting" className="text-gray-900 hover:text-blue-500">
            Voting
          </Link>
          <Link href="/result" className="text-gray-900 hover:text-blue-500">
            Result
          </Link>
        </div>
        <div className="w-1/4 flex justify-end px-10 space-x-5 font-semibold text-lg">
          <Link
            href="/auth/login"
            className="outline-indigo-500 outline-2 text-indigo-500 w-1/3 text-center h-10 content-center rounded hover:bg-indigo-500 hover:text-white">
            Login
          </Link>
          <Link
            href="/auth/register"
            className="outline-indigo-500 outline bg-indigo-500 text-white  rounded hover:bg-indigo-600 w-1/3  text-center h-10 content-center">
            Register
          </Link>
        </div>
      </nav>
    </div>
  );
}
