import Image from "next/image";
import Link from "next/link";

export default function MentorCard({ mentor }) {
  return (
    <div className="flex items-center justify-between bg-white shadow rounded-lg p-4">
      <div>
        <h2 className="font-semibold text-lg">{mentor.name}</h2>
        <p className="text-gray-600">{mentor.bio}</p>
        <Link href={`/mentors/${mentor._id}`}>
          <button className="mt-2 px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300">View Profile</button>
        </Link>
      </div>
    </div>
  );
}
