import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Role } from "@prisma/client";

export default async function BuyerDashboard() {
    const session = await auth();

    if (!session?.user) {
        redirect("/auth/sign-in");
    }

    if (session.user.role !== Role.BUYER) {
        redirect("/");
    }

    // Fetch Buyer's Requests (Placeholder for now until model logic is fully used)
    // assuming PurchaseRequest model has userId
    const myRequests = await prisma.purchaseRequest.findMany({
        where: { buyerId: session.user.id },
        orderBy: { createdAt: "desc" },
    });

    return (
        <div className="min-h-screen bg-neutral-50 p-8 pt-24 font-sans text-neutral-900">
            <div className="max-w-6xl mx-auto">
                <header className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
                        <p className="text-neutral-600">Manage your purchase requests and track offers.</p>
                    </div>
                    <Link
                        href="/buyer/create-request"
                        className="px-6 py-2 bg-emerald-600 text-white rounded-full font-medium hover:bg-emerald-700 transition"
                    >
                        Create New Request
                    </Link>
                </header>

                <section>
                    <h2 className="text-xl font-semibold mb-4">My Requests</h2>
                    {myRequests.length === 0 ? (
                        <div className="bg-white p-6 rounded-xl border border-neutral-200 text-center py-12">
                            <p className="text-neutral-500 mb-4">You haven't posted any requests yet.</p>
                            <Link
                                href="/buyer/create-request"
                                className="text-emerald-600 font-medium hover:underline"
                            >
                                Post your first request now
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {myRequests.map((req) => (
                                <div key={req.id} className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-lg">{req.cropName}</h3>
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">{req.status}</span>
                                    </div>
                                    <p className="text-neutral-600 text-sm mb-4">{req.quantity} {req.unit} needed</p>
                                    <div className="text-sm text-neutral-500">
                                        <p>Max Price: ₹{req.maxPrice}</p>
                                        <p>Expected: {req.expectedDate.toLocaleDateString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
