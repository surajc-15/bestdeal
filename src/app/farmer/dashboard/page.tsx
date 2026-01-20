import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";

export default async function FarmerDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    if (session.user.role !== Role.FARMER) {
        redirect("/");
    }

    // Fetch Active Requests from Buyers
    const activeRequests = await prisma.purchaseRequest.findMany({
        where: { status: "OPEN" },
        orderBy: { createdAt: "desc" },
        include: { user: { select: { name: true } } }, // Include buyer name
    });

    return (
        <div className="min-h-screen bg-neutral-50 p-8 pt-24 font-sans text-neutral-900">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-900">Farmer Dashboard</h1>
                    <p className="text-neutral-600">Find buyers for your harvest and get the best deals.</p>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-4">Active Requirements from Buyers</h2>
                    {activeRequests.length === 0 ? (
                        <div className="bg-white p-12 rounded-xl border border-neutral-200 text-center">
                            <p className="text-neutral-500">No active requirements at the moment. Please check back later.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {activeRequests.map((req) => (
                                <div key={req.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:border-emerald-500 transition group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg group-hover:text-emerald-700 transition">{req.cropName}</h3>
                                        <span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded">
                                            {req.user.name}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-neutral-600 mb-4">
                                        <div className="flex justify-between">
                                            <span>Quantity:</span>
                                            <span className="font-medium text-black">{req.quantity} {req.unit}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Max Price:</span>
                                            <span className="font-medium text-emerald-700">₹{req.maxPrice}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Needed By:</span>
                                            <span>{req.expectedDate.toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <button className="w-full py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 transition">
                                        Make an Offer
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
