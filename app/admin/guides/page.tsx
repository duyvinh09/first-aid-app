"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pencil, Trash2, Eye, Video } from "lucide-react";

interface Step {
  title: string;
  content: string;
  duration: string;
  image: string;
  audio: string;
}

interface Guide {
  id: string;
  title: string;
  description: string;
  tags: string[];
  level: string;
  createdAt: string;
  videoUrl?: string;
  images?: { url: string; alt: string }[];
  steps?: Step[];
}

// Example data
const guides: Guide[] = [
  {
    id: "cpr",
    title: "CPR (Cardiopulmonary Resuscitation)",
    description: "CPR can help save a life during a cardiac or breathing emergency.",
    tags: ["cardiac", "resuscitation", "emergency", "breathing", "life-saving"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-cpr-full.mp4",
    images: [
      { url: "/placeholder.svg?height=400&width=600", alt: "CPR hand placement" },
      { url: "/placeholder.svg?height=400&width=600", alt: "CPR compression technique" },
    ],
    steps: [
      {
        title: "Check responsiveness",
        content: "Tap shoulder and ask 'Are you OK?'",
        duration: "30 seconds",
        image: "/placeholder-step1.svg",
        audio: "/placeholder-step1.mp3",
      },
      {
        title: "Call emergency",
        content: "If unresponsive, call 115 or ask someone else to call.",
        duration: "1 minute",
        image: "/placeholder-step2.svg",
        audio: "",
      },
      {
        title: "Chest compressions",
        content: "Place hands correctly and compress at 100-120/min.",
        duration: "2 minutes",
        image: "/placeholder-step5.svg",
        audio: "/placeholder-step5.mp3",
      },
    ],
  },
  {
    id: "burns",
    title: "Burns Treatment",
    description: "Proper first aid for burns can prevent infection and reduce pain.",
    tags: ["burns", "wound", "treatment", "first aid", "injury"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-burn-treatment.mp4",
    images: [
      { url: "/placeholder.svg?height=400&width=600", alt: "Burn severity assessment" },
      { url: "/placeholder.svg?height=400&width=600", alt: "Proper burn cooling technique" },
    ],
    steps: [
      {
        title: "Ensure safety",
        content: "Remove the person from danger and stop burning process.",
        duration: "1 minute",
        image: "/placeholder-step1.svg",
        audio: "",
      },
      {
        title: "Cool the burn",
        content: "Use cool running water 10-15 minutes, do not use ice.",
        duration: "15 minutes",
        image: "/placeholder-burn-cooling.svg",
        audio: "",
      },
    ],
  },
  {
    id: "bleeding",
    title: "Bleeding",
    description: "Stop bleeding and care for wounds effectively.",
    tags: ["bleeding", "wound", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-bleeding.mp4",
    images: [
      { url: "/placeholder.svg?height=400&width=600", alt: "Apply pressure to wound" },
    ],
    steps: [
      {
        title: "Apply pressure",
        content: "Use a clean cloth to press on the wound.",
        duration: "5 minutes",
        image: "/placeholder-step1.svg",
        audio: "",
      },
      {
        title: "Elevate limb",
        content: "Raise the injured area above heart level if possible.",
        duration: "1 minute",
        image: "/placeholder-step2.svg",
        audio: "",
      },
    ],
  },
  {
    id: "choking",
    title: "Choking",
    description: "Perform the Heimlich maneuver to help a choking person.",
    tags: ["choking", "airway", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-choking.mp4",
    images: [
      { url: "/placeholder.svg?height=400&width=600", alt: "Heimlich maneuver" },
    ],
    steps: [
      {
        title: "Assess airway",
        content: "Check if the person can speak or cough.",
        duration: "30 seconds",
        image: "/placeholder-step1.svg",
        audio: "",
      },
      {
        title: "Perform Heimlich",
        content: "Give abdominal thrusts until object is expelled.",
        duration: "1-2 minutes",
        image: "/placeholder-step2.svg",
        audio: "",
      },
    ],
  },
  {
    id: "fractures",
    title: "Fractures",
    description: "First aid for bone fractures and immobilization.",
    tags: ["fracture", "bone", "injury", "first aid"],
    level: "Medium",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-fractures.mp4",
    images: [
      { url: "/placeholder.svg?height=400&width=600", alt: "Immobilize fracture" },
    ],
    steps: [
      {
        title: "Stabilize limb",
        content: "Use a splint or soft padding to immobilize the area.",
        duration: "5 minutes",
        image: "/placeholder-step1.svg",
        audio: "",
      },
    ],
  },
  {
    id: "fever",
    title: "Fever",
    description: "Manage high temperature and reduce discomfort.",
    tags: ["fever", "temperature", "first aid", "health"],
    level: "Medium",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-fever.mp4",
    images: [],
    steps: [
      {
        title: "Cool body",
        content: "Apply cool compresses or take medication if needed.",
        duration: "10 minutes",
        image: "",
        audio: "",
      },
    ],
  },
  {
    id: "poisoning",
    title: "Poisoning",
    description: "Treatment and first aid for poisoning or toxic exposure.",
    tags: ["poison", "toxic", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-poisoning.mp4",
    images: [],
    steps: [
      {
        title: "Identify poison",
        content: "Determine substance and call emergency services immediately.",
        duration: "1 minute",
        image: "",
        audio: "",
      },
    ],
  },
  {
    id: "cuts",
    title: "Cuts & Wounds",
    description: "Care for minor cuts and prevent infection.",
    tags: ["cuts", "wound", "first aid", "injury"],
    level: "Low",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-cuts.mp4",
    images: [],
    steps: [
      {
        title: "Clean wound",
        content: "Rinse with water and apply antiseptic.",
        duration: "2 minutes",
        image: "",
        audio: "",
      },
    ],
  },
  {
    id: "shock",
    title: "Shock",
    description: "Recognize and manage shock effectively.",
    tags: ["shock", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-shock.mp4",
    images: [],
    steps: [
      {
        title: "Lay down person",
        content: "Keep legs elevated and monitor breathing.",
        duration: "5 minutes",
        image: "",
        audio: "",
      },
    ],
  },
  {
    id: "eye-injury",
    title: "Eye Injury",
    description: "First aid for eye trauma and injuries.",
    tags: ["eye", "injury", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-eye-injury.mp4",
    images: [],
    steps: [
      {
        title: "Rinse eye",
        content: "Use clean water to flush out foreign objects.",
        duration: "5 minutes",
        image: "",
        audio: "",
      },
    ],
  },
  {
    id: "head-injury",
    title: "Head Injury",
    description: "Assess and manage head trauma carefully.",
    tags: ["head", "injury", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-head-injury.mp4",
    images: [],
    steps: [
      {
        title: "Check consciousness",
        content: "Monitor for confusion or vomiting.",
        duration: "5 minutes",
        image: "",
        audio: "",
      },
    ],
  },
  {
    id: "allergic-reaction",
    title: "Allergic Reaction",
    description: "Treat severe allergic reactions (anaphylaxis) promptly.",
    tags: ["allergy", "reaction", "emergency", "first aid"],
    level: "High",
    createdAt: "2025-09-20",
    videoUrl: "/placeholder-allergic-reaction.mp4",
    images: [],
    steps: [
      {
        title: "Administer epinephrine",
        content: "Use auto-injector immediately if available.",
        duration: "1 minute",
        image: "",
        audio: "",
      },
    ],
  },
  // Add other guides similarly...
];

export default function GuideListPage() {
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");

  const filteredGuides = guides.filter(
    (g) =>
      g.title.toLowerCase().includes(search.toLowerCase()) &&
      (levelFilter ? g.level === levelFilter : true)
  );

  const handleView = (guide: Guide) => {
    alert(`Viewing guide: ${guide.title}`);
  };

  const handleEdit = (guide: Guide) => {
    alert(`Editing guide: ${guide.title}`);
  };

  const handleDelete = (guide: Guide) => {
    if (confirm(`Are you sure you want to delete "${guide.title}"?`)) {
      alert(`Deleted guide: ${guide.title} (demo)`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-red-600 flex items-center space-x-2">
        <button
          type="button"
          onClick={() => (window.location.href = "/admin")}
          className="text-2xl text-black font-bold p-1 rounded hover:border hover:border-black transition-all duration-200"
        >
          ←
        </button>
        <span>Guide Management</span>
      </h1>

      {/* Search and level filter */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input
          placeholder="Search by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />
        <select
          value={levelFilter}
          onChange={(e) => setLevelFilter(e.target.value)}
          className="w-[180px] border rounded px-2 py-1"
        >
          <option value="">Filter by Level</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Level</TableHead>
                <TableHead>Created At</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredGuides.map((g) => (
                <TableRow key={g.id}>
                  <TableCell className="font-semibold">{g.title}</TableCell>
                  <TableCell>{g.description}</TableCell>
                  <TableCell>
                    {g.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded mr-1"
                      >
                        {tag}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 text-xs rounded font-medium ${
                        g.level === "High"
                          ? "bg-red-600 text-white"
                          : g.level === "Medium"
                          ? "bg-yellow-300 text-black"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {g.level}
                    </span>
                  </TableCell>
                  <TableCell>{g.createdAt}</TableCell>
                  <TableCell className="flex gap-2 justify-center">
                    <Button variant="outline" size="icon" onClick={() => handleView(g)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleEdit(g)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {g.videoUrl && (
                      <a href={g.videoUrl} target="_blank" rel="noopener noreferrer">
                        <Button variant="outline" size="icon">
                          <Video className="h-4 w-4 text-blue-600" />
                        </Button>
                      </a>
                    )}
                    <Button variant="destructive" size="icon" onClick={() => handleDelete(g)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}