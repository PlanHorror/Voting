export default function VotesPage() {
  return (
    <div className="flex items-center justify-center w-full h-full px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-lg">
        <h2 className="mb-4 text-2xl font-semibold text-center text-gray-900">
          Votes
        </h2>
        <div className="flex flex-col items-center justify-center w-full h-full gap-4">
          <p className="text-lg font-semibold">No votes available</p>
        </div>
      </div>
    </div>
  );
}
