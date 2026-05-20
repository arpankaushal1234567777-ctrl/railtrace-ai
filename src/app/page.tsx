import Navbar from "@/components/ui/Navbar";
import Hero from "@/components/ui/Hero";
import SearchBox from "@/components/ui/SearchBox";

export default function HomePage() {
  return (
    <main className="rt-page">
      <div className="rt-bg" />

      <div className="rt-container">
        <Navbar />
        <Hero />
        <SearchBox />
      </div>
    </main>
  );
}