import axios from 'axios';

const COMPANIES = {
  OPENAI: {
    name: 'OpenAI',
    boardId: 'openai'
  },
  CHARACTER: {
    name: 'Character',
    boardId: 'character'
  },
  DISTYL: {
    name: 'Distyl',
    boardId: 'distyl'
  },
  SYNTHFLOW: {
    name: 'Synthflow',
    boardId: 'synthflow'
  },
  PROTECTAI: {
    name: 'Protect AI',
    boardId: 'protectai'
  },
  PERSONAAI: {
    name: 'Persona AI',
    boardId: 'personainc.ai'
  },
  ALTIMATEAI: {
    name: 'Altimate AI',
    boardId: 'altimate'
  },
  ESSENTIALAI: {
    name: 'Essential AI',
    boardId: 'essentialai'
  },
  BASIS: {
    name: 'Basis',
    boardId: 'basis-ai'
  },
  ATARAXIS: {
    name: 'Ataraxis',
    boardId: 'ataraxis-ai'
  },
  ROSSUM: {
    name: 'Rossum',
    boardId: 'rossum.ai'
  },
  FIREWORKSAI: {
    name: 'Fireworks AI',
    boardId: 'fireworks.ai'
  },
  LEONARDOAI: {
    name: 'Leonardo AI',
    boardId: 'leonardo.ai'
  },
  MEDBILLAI: {
    name: 'Medbill AI',
    boardId: 'medbill-ai'
  },
  LUMINO: {
    name: 'Lumino',
    boardId: 'luminoAI'
  },
  SIENA: {
    name: 'Siena',
    boardId: 'siena'
  },
  HIPPOCRATICAI: {
    name: 'Hippocratic AI',
    boardId: 'Hippocratic%20AI'
  }
};

const API_BASE_URL = process.env.REACT_APP_ASHBY_API_BASE_URL || 'https://api.ashbyhq.com/posting-api/job-board';

const createAxiosInstance = (boardId) => {
  return axios.create({
    baseURL: `${API_BASE_URL}/${boardId}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    withCredentials: false // Allow cross-origin requests
  });
};

const processJob = (job, company) => {
  // Parse location carefully
  let location = '';
  
  // First try to get location from job.location
  if (job.location) {
    location = job.location;
  }
  // Then try to get from address
  else if (job.address?.postalAddress) {
    const { addressLocality, addressRegion } = job.address.postalAddress;
    
    // Special handling for Tokyo and Singapore
    if (addressLocality === 'Tokyo') {
      location = 'Tokyo, Japan';
    } else if (addressLocality === 'Singapore') {
      location = 'Singapore';
    } else if (addressLocality && addressRegion) {
      location = `${addressLocality}, ${addressRegion}`;
    } else if (addressLocality) {
      location = addressLocality;
    }
  }
  
  // Ensure we have a location
  location = location || 'Location not specified';
  
  // Convert employment type to consistent format
  let employmentType = job.employmentType || 'FULLTIME';
  employmentType = employmentType.replace(/([A-Z])/g, ' $1').trim();
  employmentType = employmentType.charAt(0).toUpperCase() + employmentType.slice(1).toLowerCase();
  
  return {
    id: `${company.boardId}-${job.id || Math.random().toString(36).substr(2, 9)}`,
    title: job.title || 'Untitled Position',
    companyName: company.name,
    location: location,
    remote: Boolean(job.isRemote),
    salary: job.compensation?.compensationTierSummary || 'Salary not specified',
    department: job.department || 'General',
    url: job.jobUrl || job.applyUrl || `https://jobs.ashbyhq.com/${company.boardId}/${job.id}`,
    description: job.descriptionPlain || job.descriptionHtml || '',
    employmentType: employmentType
  };
};

const fetchJobsFromCompany = async (company) => {
  try {
    const axiosInstance = createAxiosInstance(company.boardId);
    const response = await axiosInstance.get('', {
      params: {
        includeCompensation: true
      }
    });
    
    if (!response.data || !Array.isArray(response.data.jobs)) {
      console.error(`Invalid response format for ${company.name}:`, response.data);
      return [];
    }

    return response.data.jobs.map(job => processJob(job, company));
  } catch (error) {
    console.error(`Error fetching jobs for ${company.name}:`, error);
    return [];
  }
};

// Fetch initial jobs as fast as possible
const fetchInitialJobs = async (onJobsReceived) => {
  const companies = Object.values(COMPANIES);
  
  // Create a promise for each company that will resolve as soon as it gets any jobs
  const companyPromises = companies.map(company => 
    fetchJobsFromCompany(company)
      .then(jobs => {
        if (jobs.length > 0) {
          onJobsReceived(jobs.slice(0, 6));
        }
        return jobs;
      })
  );

  // Start all fetches in parallel
  Promise.all(companyPromises).then(allJobs => {
    // After all initial jobs are fetched, combine them all (this will be used for the full list)
    const remainingJobs = allJobs.flat();
    onJobsReceived(remainingJobs);
  });
};

const api = {
  fetchInitialJobs
};

export default api;
