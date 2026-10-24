
import { createContext, useContext, useEffect, useState } from "react";

const JobContext = createContext();
const demoSeedIds = new Set(["1", "2", "3", "4", "5"]);

function getStorageKey(type) {
  try {
    const email = JSON.parse(localStorage.getItem("jobTrackUser") || "null")?.email?.trim().toLowerCase() || "guest";
    return `jobtrack:${email}:${type}`;
  } catch {
    return `jobtrack:guest:${type}`;
  }
}

function readList(key) {
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function JobProvider({ children }) {
  const [jobs, setJobs] = useState(() => {
    try {
      const key = getStorageKey("applications");
      const parsed = JSON.parse(localStorage.getItem(key) || localStorage.getItem("careertrack-jobs") || "[]");
      // Remove the fixed sample records from earlier prototype versions, but
      // keep all user-created records (which use generated IDs).
      return Array.isArray(parsed)
        ? parsed.filter((job) => !demoSeedIds.has(String(job.id)))
        : [];
    } catch {
      return [];
    }
  });
  const [savedJobs, setSavedJobs] = useState(() => readList(getStorageKey("saved-jobs")));

  useEffect(() => {
    try {
      localStorage.setItem(getStorageKey("applications"), JSON.stringify(jobs));
      localStorage.setItem(getStorageKey("saved-jobs"), JSON.stringify(savedJobs));
    } catch (error) {
      console.error("Unable to save job applications in this browser.", error);
    }
  }, [jobs, savedJobs]);

  const addJob = (job) => {
    const now = new Date().toISOString();
    const newJob = {
      ...job,
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: now,
      updatedAt: now
    };
    setJobs((previous) => [newJob, ...previous]);
    return newJob;
  };

  const updateJob = (id, changes) => {
    setJobs((previous) =>
      previous.map((job) =>
        job.id === id ? { ...job, ...changes, updatedAt: new Date().toISOString() } : job
      )
    );
  };

  const deleteJob = (id) => {
    setJobs((previous) => previous.filter((job) => job.id !== id));
  };

  const saveJob = (job) => setSavedJobs((previous) => previous.some((item) => item.id === job.id) ? previous : [{ ...job, savedAt: new Date().toISOString() }, ...previous]);
  const unsaveJob = (id) => setSavedJobs((previous) => previous.filter((job) => job.id !== id));
  const moveSavedToApplications = (job) => {
    addJob({ company: job.company, role: job.role, date: "", status: "Wishlist", type: job.type || "Full-time", location: job.workMode || job.location || "Remote", salary: job.salary || "", notes: job.description || "Added from illustrative listing.", source: "JobTrack sample listing", interviewDate: "" });
    unsaveJob(job.id);
  };

  return (
    <JobContext.Provider value={{ jobs, addJob, updateJob, deleteJob, savedJobs, saveJob, unsaveJob, moveSavedToApplications }}>
      {children}
    </JobContext.Provider>
  );
}

export function useJobs() {
  const context = useContext(JobContext);

  if (!context) {
    throw new Error("useJobs must be used inside JobProvider");
  }

  return context;
}
