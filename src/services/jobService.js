
function getStorageKey() {
  try {
    const user = JSON.parse(localStorage.getItem("jobTrackUser") || "null");
    return `jobtrack:${user?.email?.trim().toLowerCase() || "guest"}:applications`;
  } catch {
    return "jobtrack:guest:applications";
  }
}

function readJobs() {
  try {
    const value = JSON.parse(localStorage.getItem(getStorageKey()) || "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function writeJobs(jobs) {
  localStorage.setItem(getStorageKey(), JSON.stringify(jobs));
}

const jobService = {
  async getJobs() {
    return readJobs();
  },

  async getJob(id) {
    return readJobs().find(job => job.id === id) || null;
  },

  async createJob(job) {
    const now = new Date().toISOString();
    const newJob = {
      ...job,
      id: globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      createdAt: now,
      updatedAt: now
    };
    writeJobs([newJob, ...readJobs()]);
    return newJob;
  },

  async updateJob(id, changes) {
    const jobs = readJobs().map(job =>
      job.id === id ? { ...job, ...changes, updatedAt: new Date().toISOString() } : job
    );
    writeJobs(jobs);
    return jobs.find(job => job.id === id) || null;
  },

  async deleteJob(id) {
    writeJobs(readJobs().filter(job => job.id !== id));
    return true;
  }
};

export default jobService;
