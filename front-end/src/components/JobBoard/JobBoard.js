import React, { useState, useEffect } from 'react';
import './JobBoard.css';

// 模拟的工作数据，实际应用中应该从API获取
const initialJobs = [
  { id: 1, job: 'Software Engineer', company: 'Google', updateDate: '2023-05-15', location: 'Mountain View, CA', yoe: '3-5', link: 'https://google.com/careers', roleType: 'sde', experience: 'experienced', sponsorship: 'sponsor' },
  { id: 2, job: 'Data Scientist', company: 'Facebook', updateDate: '2023-05-14', location: 'Menlo Park, CA', yoe: '2-4', link: 'https://facebook.com/careers', roleType: 'ds', experience: 'entry level', sponsorship: 'sponsor' },
  { id: 3, job: 'Product Manager', company: 'Amazon', updateDate: '2023-05-13', location: 'Seattle, WA', yoe: '5-7', link: 'https://amazon.com/careers', roleType: 'pm', experience: 'experienced', sponsorship: 'sponsor' },
  { id: 4, job: 'UX Designer', company: 'Apple', updateDate: '2023-05-12', location: 'Cupertino, CA', yoe: '3-6', link: 'https://apple.com/careers', roleType: 'design', experience: 'experienced', sponsorship: 'no sponsor' },
  { id: 5, job: 'Frontend Developer', company: 'Microsoft', updateDate: '2023-05-11', location: 'Redmond, WA', yoe: '2-5', link: 'https://microsoft.com/careers', roleType: 'sde', experience: 'entry level', sponsorship: 'sponsor' },
  // ... 添加更多工作数据以测试分页功能
];

const ITEMS_PER_PAGE = 20;

function JobBoard() {
  const [jobs, setJobs] = useState(initialJobs);
  const [filteredJobs, setFilteredJobs] = useState(initialJobs);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    roleType: [],
    experience: [],
    sponsorship: [],
    locations: [],
  });
  const [locationInput, setLocationInput] = useState('');

  useEffect(() => {
    applyFilters();
  }, [searchTerm, filters]);

  const applyFilters = () => {
    let result = jobs.filter(job => 
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.job.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filters.roleType.length > 0) {
      result = result.filter(job => filters.roleType.includes(job.roleType));
    }
    if (filters.experience.length > 0) {
      result = result.filter(job => filters.experience.includes(job.experience));
    }
    if (filters.sponsorship.length > 0) {
      result = result.filter(job => filters.sponsorship.includes(job.sponsorship));
    }
    if (filters.locations.length > 0) {
      result = result.filter(job => 
        filters.locations.some(location => 
          job.location.toLowerCase().includes(location.toLowerCase())
        )
      );
    }

    setFilteredJobs(result);
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({
      roleType: [],
      experience: [],
      sponsorship: [],
      locations: [],
    });
    setSearchTerm('');
    setLocationInput('');
  };

  const toggleFilter = (filterType, value) => {
    setFilters(prevFilters => {
      const updatedFilter = prevFilters[filterType].includes(value)
        ? prevFilters[filterType].filter(item => item !== value)
        : [...prevFilters[filterType], value];
      return { ...prevFilters, [filterType]: updatedFilter };
    });
  };

  const addLocation = () => {
    if (locationInput && !filters.locations.includes(locationInput)) {
      setFilters(prevFilters => ({
        ...prevFilters,
        locations: [...prevFilters.locations, locationInput]
      }));
      setLocationInput('');
    }
  };

  const removeLocation = (location) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      locations: prevFilters.locations.filter(loc => loc !== location)
    }));
  };

  const pageCount = Math.ceil(filteredJobs.length / ITEMS_PER_PAGE);
  const displayedJobs = filteredJobs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="job-board">
      <h1>Job Board</h1>
      <div className="search-filter">
        <input
          type="text"
          placeholder="Search jobs or companies"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setShowFilters(!showFilters)}>
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
        <button onClick={clearFilters}>Clear Filters</button>
      </div>
      
      {showFilters && (
        <div className="filters">
          <div className="filter-group">
            <h3>Role Type</h3>
            {['sde', 'mle', 'ds'].map(role => (
              <button
                key={role}
                onClick={() => toggleFilter('roleType', role)}
                className={filters.roleType.includes(role) ? 'active' : ''}
              >
                {role.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <h3>Experience</h3>
            {['intern', 'ng', 'entry level', 'experienced'].map(exp => (
              <button
                key={exp}
                onClick={() => toggleFilter('experience', exp)}
                className={filters.experience.includes(exp) ? 'active' : ''}
              >
                {exp}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <h3>Sponsorship</h3>
            {['sponsor', 'no sponsor'].map(sponsor => (
              <button
                key={sponsor}
                onClick={() => toggleFilter('sponsorship', sponsor)}
                className={filters.sponsorship.includes(sponsor) ? 'active' : ''}
              >
                {sponsor}
              </button>
            ))}
          </div>
          <div className="filter-group">
            <h3>Locations</h3>
            <div className="location-input">
              <input
                type="text"
                placeholder="Add location (City, State)"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addLocation()}
              />
              <button onClick={addLocation}>Add</button>
            </div>
            <div className="location-tags">
              {filters.locations.map(location => (
                <span key={location} className="location-tag">
                  {location}
                  <button onClick={() => removeLocation(location)}>×</button>
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Job</th>
            <th>Company</th>
            <th>Update Date</th>
            <th>Location</th>
            <th>Years of Experience</th>
          </tr>
        </thead>
        <tbody>
          {displayedJobs.map(job => (
            <tr key={job.id}>
              <td><a href={job.link} target="_blank" rel="noopener noreferrer">{job.job}</a></td>
              <td>{job.company}</td>
              <td>{job.updateDate}</td>
              <td>{job.location}</td>
              <td>{job.yoe}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map(page => (
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={currentPage === page ? 'active' : ''}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}

export default JobBoard;
