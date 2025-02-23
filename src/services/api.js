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

const fetchJobsForCompany = async (company) => {
  try {
    console.log(`Fetching jobs for ${company.name}...`);
    const axiosInstance = createAxiosInstance(company.boardId);
    
    const response = await axiosInstance.get('', {
      params: {
        includeCompensation: true
      }
    });
    
    if (!response.data || !Array.isArray(response.data.jobs)) {
      console.error(`Invalid response format for ${company.name}:`, response.data);
      throw new Error(`Invalid response format from API for ${company.name}`);
    }

    console.log(`Total jobs from API for ${company.name}:`, response.data.jobs.length);
    
    return response.data.jobs.map(job => {
      // Parse location carefully
      let location = '';
      
      // First try to get location from job.location
      if (job.location) {
        location = job.location;
      }
      // Then try to get from address
      else if (job.address?.postalAddress) {
        const { addressLocality, addressRegion, addressCountry } = job.address.postalAddress;
        
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
      
      console.log(`Job ${job.id} (${job.title}): Location = ${location}`);
      
      // Convert employment type to consistent format
      let employmentType = job.employmentType || 'FULLTIME';
      employmentType = employmentType.replace(/([A-Z])/g, ' $1').trim();
      employmentType = employmentType.charAt(0).toUpperCase() + employmentType.slice(1).toLowerCase();
      
      return {
        id: job.id || String(Math.random()),
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
    });
  } catch (error) {
    console.error(`API Error for ${company.name}:`, error);
    throw error;
  }
};

export const fetchJobs = async () => {
  try {
    // Fetch jobs from all companies in parallel
    const jobPromises = Object.values(COMPANIES).map(company => 
      fetchJobsForCompany(company)
        .catch(error => {
          console.error(`Failed to fetch jobs for ${company.name}:`, error);
          return []; // Return empty array if company fetch fails
        })
    );

    const jobsArrays = await Promise.all(jobPromises);
    const allJobs = jobsArrays.flat();

    console.log('Total jobs found across all companies:', allJobs.length);
    console.log('Jobs by company:', jobsArrays.map((jobs, i) => ({
      company: Object.values(COMPANIES)[i].name,
      count: jobs.length
    })));
    
    return { jobs: allJobs };
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};
