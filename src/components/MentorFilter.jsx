export default function MentorFilters() {
  return (
    <div className="flex gap-4">
      <select className="border p-2 rounded">
        <option>Domain</option>
        <option>UI/UX</option>
        <option>Marketing</option>
        <option>Tech</option>
      </select>

      <select className="border p-2 rounded">
        <option>Experience Level</option>
        <option>0-3 Years</option>
        <option>3-6 Years</option>
        <option>6+ Years</option>
      </select>

      <select className="border p-2 rounded">
        <option>Availability</option>
        <option>Morning</option>
        <option>Evening</option>
      </select>
    </div>
  );
}
