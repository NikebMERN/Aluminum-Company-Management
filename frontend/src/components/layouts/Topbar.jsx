export default function Topbar({ title }) {
    return (
        <div className="bg-gray-800 text-white p-4 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl font-bold">
                    {title}
                </h1>
        </div>
    );
}
