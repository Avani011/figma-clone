"use client";

import { Room } from "./Room";
import { CollaborativeApp } from "./CollaborativeApp";
import Live from "@/components/Live";
import Navbar from "@/components/Users/Navbar";
import LeftSideBar from "@/components/LeftSideBar";
import RightSidebar from "@/components/RightSidebar";

export default function Page() {
  return (
      <main className="h-screen overflow-hidden">
        <Navbar />
        <section className="flex h-full flex-row">
          < LeftSideBar />
          <Live />
          <RightSidebar />
        </section>
      </main>
  );
}