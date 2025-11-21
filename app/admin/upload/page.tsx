"use client"

import { useState } from "react"

type Step = {
  title: string
  content: string
  duration: string
  image: string
  audio: string
}

export default function UploadGuidePage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const [priority, setPriority] = useState("medium")
  const [category, setCategory] = useState("emergency")
  const [videoUrl, setVideoUrl] = useState("")
  const [steps, setSteps] = useState<Step[]>([])

  const addStep = () => {
    setSteps([...steps, { title: "", content: "", duration: "", image: "", audio: "" }])
  }

  const updateStep = (index: number, field: keyof Step, value: string) => {
    const newSteps = [...steps]
    newSteps[index][field] = value
    setSteps(newSteps)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const data = { title, description, tags, priority, category, videoUrl, steps }
    console.log(data)
    alert("Guide uploaded successfully (demo)")
  }

  return (
    <div className="min-h-screen bg-background p-6">
<h1 className="text-2xl font-bold mb-6 text-red-600 flex items-center space-x-2">
  <button
    type="button"
    onClick={() => (window.location.href = "/admin")}
    className="text-2xl text-black font-bold p-1 rounded hover:border hover:border-black transition-all duration-200"
  >
    ←
  </button>
  <span>Upload New Guide</span>
</h1>


      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white p-6 rounded-lg border shadow-sm w-full"
      >
        {/* Title */}
        <div>
          <label className="block text-sm font-medium">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-red-500 focus:ring-red-500 sm:text-sm"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium">Short Description *</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-red-500 focus:ring-red-500 sm:text-sm"
            required
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium">Tags (comma separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="cardiac, resuscitation, emergency"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
        </div>

        {/* Priority & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium">Priority</label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-red-500 focus:ring-red-500 sm:text-sm"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                         focus:border-red-500 focus:ring-red-500 sm:text-sm"
            >
              <option value="emergency">Emergency</option>
              <option value="general">General</option>
              <option value="first-aid">First Aid</option>
            </select>
          </div>
        </div>

        {/* Video URL */}
        <div>
          <label className="block text-sm font-medium">Video URL</label>
          <input
            type="text"
            value={videoUrl}
            onChange={(e) => setVideoUrl(e.target.value)}
            placeholder="https://youtube.com/..."
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                       focus:border-red-500 focus:ring-red-500 sm:text-sm"
          />
        </div>

        {/* Steps */}
        <div>
          <label className="block text-sm font-medium">Guide Steps</label>
          {steps.map((step, i) => (
            <div key={i} className="mt-4 space-y-3 rounded-md border p-4">
              <input
                type="text"
                placeholder={`Step ${i + 1} Title`}
                value={step.title}
                onChange={(e) => updateStep(i, "title", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <textarea
                placeholder="Step Instructions"
                value={step.content}
                onChange={(e) => updateStep(i, "content", e.target.value)}
                rows={3}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                type="text"
                placeholder="Duration (e.g., 30 seconds)"
                value={step.duration}
                onChange={(e) => updateStep(i, "duration", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={step.image}
                onChange={(e) => updateStep(i, "image", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
              <input
                type="text"
                placeholder="Audio URL"
                value={step.audio}
                onChange={(e) => updateStep(i, "audio", e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm 
                           focus:border-red-500 focus:ring-red-500 sm:text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="mt-3 px-4 py-2 bg-gray-100 text-sm rounded-md hover:bg-gray-200"
          >
            + Add Step
          </button>
        </div>

        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="px-6 py-2 bg-red-600 text-white rounded-md 
                       hover:bg-red-700 transition-colors"
          >
            Upload
          </button>
        </div>
      </form>
    </div>
  )
}
