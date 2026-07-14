export default function SharedPage({ title, description, icon: Icon }) {
  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center gap-3 text-indigo-600">
          <div className="rounded-2xl bg-indigo-50 p-3"><Icon className="h-6 w-6" /></div>
          <h2 className="text-2xl font-semibold text-slate-800">{title}</h2>
        </div>
        <p className="mt-4 text-slate-600">{description}</p>
        <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">This shared page is ready for the next stage of auth and profile workflows.</div>
      </div>
    </div>
  );
}
