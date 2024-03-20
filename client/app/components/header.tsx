import Link from "next/link";

export default function Header({
  id,
  email,
}: {
  id: string | undefined;
  email: string | undefined;
}) {
  const links = [
    !email && { label: "SignUp", href: "/auth/signup" },
    !email && { label: "SignIn", href: "/auth/signin" },
    email && { label: "SignOut", href: "/auth/signout" },
  ]
    .filter((link) => link)
    .map((value: any, index) => (
      <li key={index} className="nav-item" style={{ textDecoration: "none" }}>
        <Link href={value.href}>{value.label}</Link>
      </li>
    ));

  return (
    <nav className="navbar navbar-light bg-light mb-4">
      <div className="container">
        <Link href="/" className="navbar-brand">
          GitTix
        </Link>
        <div className="d-flex justify-content-end">
          <ul className="nav d-flex align-items-center gap-3">{links}</ul>
        </div>
      </div>
    </nav>
  );
}
