import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import EditRequestForm from "./EditRequestForm";

export default async function EditRequestPage(props: { params: Promise<{ requestId: string }> }) {
    // Await params for Next.js 15+ compatibility
    const params = await props.params;
    const session = await auth();

    if (!session?.user) redirect("/auth/sign-in");

    // Fetch the request and ensure it belongs to the logged-in buyer
    const request = await prisma.purchaseRequest.findUnique({
        where: {
            id: params.requestId,
            buyerId: session.user.id
        },
    });

    if (!request) {
        return (
            <div className="min-h-screen pt-24 text-center">
                <h1 className="text-2xl font-bold text-red-600">Request Not Found or Access Denied</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neutral-50 p-6 pt-24 font-sans text-neutral-900">
            <div className="max-w-3xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-emerald-900">Edit Request</h1>
                    <p className="text-neutral-600">Update your purchase requirements.</p>
                </header>

                <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-8">
                    <EditRequestForm request={request} />
                </div>
            </div>
        </div>
    );
}
