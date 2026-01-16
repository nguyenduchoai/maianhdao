export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Login page uses its own layout, not the admin layout
    return <>{children}</>;
}
