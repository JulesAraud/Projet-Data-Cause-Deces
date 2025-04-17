export default function ChartCard({ title, children }) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-md my-6">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        {children}
      </div>
    );
  }
  