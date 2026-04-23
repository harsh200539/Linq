import CareerGrowth from "../../../../src/components/career-growth";
import { fetchMembers, generateSlug } from "../../../../src/lib/api";
import { Navbar } from "../../../../src/components/navbar";
import Footer from "../../../../src/components/footer";

export async function generateStaticParams() {
  const members = await fetchMembers();
  return members.map(member => ({
    id: generateSlug(member.name),
  }));
}

// -> THESE DYNAMIC SEO TAGS ARE FOR INDIVIDUAL EMPLOYEE PROFILE PAGES <-
export async function generateMetadata({ params }) {
  const { id } = await params;
  const members = await fetchMembers();
  const member = members.find(m => generateSlug(m.name) === id);

  if (!member) return { title: "Member Not Found | LINQ" };

  const name = member.name;
  const role = member.role || "LINQ Professional";
  const image = member.image || "/og-default-member.jpg";

  return {
    title: `${name} – ${role} at LINQ | IQHUB`,
    description: `Meet ${name}, ${role} at LINQ — the internal operations team of IQHUB. Discover their journey, expertise, and growth.`,
    alternates: {
      canonical: `https://linq-corporate.vercel.app/career-growth/member/${id}`,
    },
    openGraph: {
      title: `${name} | ${role} – LINQ Team`,
      description: `${name} is part of LINQ's dedicated team powering IQHUB's operations.`,
      url: `https://linq-corporate.vercel.app/career-growth/member/${id}`,
      images: [{ url: image }],
    },
  };
} 

export default async function Page({ params }) {
  const { id } = await params;
  const members = await fetchMembers();
  
  return (
    <>
      <Navbar bgColor="var(--linq-dark)" />
      <CareerGrowth members={members} activeMemberSlug={id} />
      <Footer />
    </>
  );
}
