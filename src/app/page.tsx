"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type NavItemProps = {
    href: string;
    label: string;
};

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex flex-col min-h-screen p-8 sm:p-20 font-geist-sans">
            <nav className="w-full flex items-center bg-gray-100 py-4 shadow-md fixed top-0 left-0 right-0">
                <button
                    className="ml-4 p-2 bg-gray-200 rounded-lg"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    ☰
                </button>
                {menuOpen && (
                    <div className="absolute top-16 left-0 bg-white shadow-md p-4 flex flex-col gap-4">
                        <NavItem href="/keywords" label="Keyword" />
                        <NavItem href="/locations" label="Location" />
                        <NavItem href="/results" label="Data Results" />
                        <NavItem href="/resultLogs" label="Data Logs" />
                        <NavItem href="/urlMatchs" label="URL Match" />
                    </div>
                )}
                <div>HOME</div>
            </nav>

            <main className="flex flex-col items-center mt-20 sm:mt-24">
                <Image
                    className="dark:invert"
                    src="/next.svg"
                    alt="Next.js logo"
                    width={180}
                    height={38}
                    priority
                />
                <p className="mt-6 text-lg text-center">Explore your data with ease</p>
            </main>
        </div>
    );
}

function NavItem({ href, label }: NavItemProps) {
    return (
        <Link href={href} className="text-black hover:underline block">
            {label}
        </Link>
    );
}
