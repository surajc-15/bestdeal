export default function Loading() {
    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24">
            <div className="max-w-7xl mx-auto">
                <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-4"></div>
                <div className="h-4 w-96 bg-neutral-200 rounded animate-pulse mb-12"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="bg-white rounded-xl shadow-sm border border-neutral-100 p-5 h-64 flex flex-col justify-between">
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <div className="h-6 w-32 bg-neutral-100 rounded animate-pulse"></div>
                                    <div className="h-6 w-16 bg-neutral-100 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-4 w-full bg-neutral-100 rounded animate-pulse"></div>
                                <div className="h-4 w-full bg-neutral-100 rounded animate-pulse"></div>
                                <div className="h-4 w-2/3 bg-neutral-100 rounded animate-pulse"></div>
                            </div>
                            <div className="h-10 w-full bg-neutral-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
