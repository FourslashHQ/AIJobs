import axios from 'axios';

const COMPANIES = {
  OPENAI: {
    name: 'OpenAI',
    boardId: 'openai'
  },
  CHARACTER: {
    name: 'Character',
    boardId: 'character'
  }
};

const createAxiosInstance = (boardId) => {
  return axios.create({
    baseURL: `https://api.ashbyhq.com/posting-api/job-board/${boardId}`,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
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
    
    console.log(`Raw API Response for ${company.name}:`, response.data);
    
    if (!response.data || !Array.isArray(response.data.jobs)) {
      console.error(`Invalid response format for ${company.name}:`, response.data);
      throw new Error(`Invalid response format from API for ${company.name}`);
    }

    // Transform the data to match our application's structure
    return response.data.jobs
      .filter(job => {
        console.log('Processing job:', {
          id: job.id,
          title: job.title,
          isListed: job.isListed
        });
        return true; // Show all jobs for now
      })
      .map(job => ({
        id: job.id || String(Math.random()),
        title: job.title || 'Untitled Position',
        companyName: company.name,
        location: job.location || 
          (job.address?.postalAddress ? 
            `${job.address.postalAddress.addressLocality}, ${job.address.postalAddress.addressRegion}` : 
            'Location not specified'),
        remote: Boolean(job.isRemote),
        salary: job.compensation?.compensationTierSummary || 'Salary not specified',
        department: job.department || 'General',
        url: job.jobUrl || job.applyUrl || `https://jobs.ashbyhq.com/${company.boardId}/${job.id}`,
        description: job.descriptionPlain || job.descriptionHtml || '',
        employmentType: job.employmentType || 'Not specified'
      }));
  } catch (error) {
    console.error(`API Error for ${company.name}:`, {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
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
    return { jobs: allJobs };
  } catch (error) {
    console.error('Error fetching all jobs:', error);
    throw error;
  }
};
