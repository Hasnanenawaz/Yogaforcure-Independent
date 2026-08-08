import type { Metadata } from "next";
import HomeClient from "@/components/HomeClient";
import { getAllCourses } from "@/lib/courses";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://yogaforcure.in";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility",
  description:
    "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.",
  alternates: {
    canonical: baseUrl + "/",
  },
  openGraph: {
    title: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility",
    description:
      "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.",
    url: baseUrl + "/",
    siteName: "Yoga by Neha",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yoga by Neha — Online Indian Yoga Teacher | Strength & Flexibility",
    description:
      "Learn with an experienced Indian yoga teacher online. Live classes in English for strength, flexibility, and lasting wellbeing. Join from anywhere.",
  },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Neha",
  jobTitle: "Yoga Instructor",
  description:
    "Indian yoga teacher offering live online yoga classes in English for strength, flexibility, and wellbeing.",
  sameAs: [
    "https://www.instagram.com/yoga_for_cure/",
    "https://youtube.com/@yogaforcurevideos",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Yoga by Neha",
  url: baseUrl + "/",
  founder: {
    "@type": "Person",
    name: "Neha",
    jobTitle: "Yoga Instructor",
  },
  areaServed: {
    "@type": "Place",
    name: "Global",
    description: "Online yoga classes worldwide",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Yoga by Neha",
  alternateName: "Yoga for Cure",
  url: baseUrl + "/",
  description:
    "Online yoga classes with an experienced Indian yoga teacher. Live group sessions, 1-on-1, and corporate wellness in English.",
  publisher: {
    "@type": "Organization",
    name: "Yoga by Neha",
    url: baseUrl + "/",
  },
};

export default async function Home() {
  const courses = await getAllCourses();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <HomeClient courses={courses} />
    </>
  );
}
