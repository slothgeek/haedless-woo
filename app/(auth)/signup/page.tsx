import RegisterForm from "@/components/ui/auth/register-form"

export default function Page() {
    return (
        <div className="flex flex-col gap-10 min-h-screen items-center justify-center p-4 w-full">
            <RegisterForm />
        </div>
    )
}