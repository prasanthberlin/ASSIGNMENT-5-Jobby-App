import {Component} from 'react'

import {Link} from 'react-router-dom'

import {BsSearch} from 'react-icons/bs'

import {AiFillStar} from 'react-icons/ai'

import {MdLocationOn} from 'react-icons/md'

import {FaSuitcase} from 'react-icons/fa'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import Header from '../Header'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Jobs extends Component {
  state = {
    profileDetails: {},
    jobsList: [],
    apiStatus: apiStatusConstants.initial,
    activeemploymentTypeId: [],
    activeSalaryRangeId: '',
    searchInput: '',
  }

  componentDidMount() {
    this.getJobs()
    this.getProfileDetails()
  }

  getProfileDetails = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()

      const updatedData = {
        name: fetchedData.profile_details.name,
        profileImageUrl: fetchedData.profile_details.profile_image_url,
        shortBio: fetchedData.profile_details.short_bio,
      }

      this.setState({
        profileDetails: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  getJobs = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {
      activeemploymentTypeId,
      activeSalaryRangeId,
      searchInput,
    } = this.state

    const formattedEmployeeType = activeemploymentTypeId.join(',')

    const apiUrl = `https://apis.ccbp.in/jobs?employment_type=${formattedEmployeeType}&minimum_package=${activeSalaryRangeId}&search=${searchInput}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const updatedData = fetchedData.jobs.map(job => ({
        companyLogoUrl: job.company_logo_url,
        employmentType: job.employment_type,
        jobDescription: job.job_description,
        id: job.id,
        location: job.location,
        packagePerAnnum: job.package_per_annum,
        rating: job.rating,
        title: job.title,
      }))
      this.setState({
        jobsList: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      })
    }
  }

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  retryJobsList = () => {
    this.getJobs()
  }

  renderFailureView = () => (
    <div className="job-error-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="jobs-failure-img"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        onClick={this.retryJobsList}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  retryProfileDetails = () => {
    this.getProfileDetails()
  }

  renderProfileFailureView = () => (
    <div className="profile-failure-view">
      <button
        type="button"
        onClick={this.retryProfileDetails}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderProfileDetail = () => {
    const {profileDetails} = this.state

    return (
      <div className="profile-container">
        <img
          src={profileDetails.profileImageUrl}
          alt="profile"
          className="profile-image"
        />
        <h1 className="profile-name">{profileDetails.name}</h1>
        <p className="job-role-title">{profileDetails.shortBio}</p>
      </div>
    )
  }

  renderJobsList = () => {
    const {jobsList} = this.state
    const shouldShowProductsList = jobsList.length > 0

    return shouldShowProductsList ? (
      <div className="all-jobs-container">
        <ul className="jobs-list">
          {jobsList.map(job => (
            <li className="job-item" key={job.id}>
              <Link to={`/jobs/${job.id}`} className="job-link-item">
                <div className="company-logo-and-job-title">
                  <img
                    src={job.companyLogoUrl}
                    className="company-logo"
                    alt="company logo"
                  />
                  <div>
                    <h1 className="job-title">{job.title}</h1>
                    <div className="rating-container">
                      <AiFillStar color="#fbbf24" size="20" />
                      <p className="rating">{job.rating}</p>
                    </div>
                  </div>
                </div>
                <div className="job-details-container">
                  <div className="location-employment-type-container">
                    <div className="job-extra-details-container">
                      <MdLocationOn size="20" />
                      <p className="job-details-text">{job.location}</p>
                    </div>
                    <div className="job-extra-details-container">
                      <FaSuitcase size="18" />
                      <p className="job-details-text">{job.employmentType}</p>
                    </div>
                  </div>
                  <p className="job-package-text">{job.packagePerAnnum}</p>
                </div>
                <hr className="separator-line" />
                <h1>Description</h1>
                <p className="job-description">{job.jobDescription}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div className="no-jobs-view">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          className="no-jobs-img"
          alt="no jobs"
        />
        <h1 className="no-jobs-heading">No Jobs Found</h1>
        <p className="no-jobs-description">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderAllJobs = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobsList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  renderProfileDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderProfileDetail()
      case apiStatusConstants.failure:
        return this.renderProfileFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  onEnterSearchInput = event => {
    if (event.key === 'Enter') {
      this.getJobs()
    }
  }

  searchUserInput = () => {
    this.getJobs()
  }

  changeSalaryRange = event => {
    this.setState({activeSalaryRangeId: event.target.value}, this.getJobs)
  }

  changeSearchInput = event => {
    this.setState({searchInput: event.target.value})
  }

  filterEmploymentType = event => {
    this.setState(
      prevState => ({
        activeemploymentTypeId: [
          ...prevState.activeemploymentTypeId,
          event.target.value,
        ],
      }),
      this.getJobs,
    )
  }

  render() {
    const {searchInput} = this.state

    return (
      <>
        <Header />
        <div className="jobs-page-container">
          <div className="search-container-mobile">
            <input
              type="search"
              placeholder="Search"
              className="search-input"
              value={searchInput}
              onChange={this.changeSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.searchUserInput}
              onKeyDown={this.onEnterSearchInput}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="desktop-view-container">
            <div className="desktop-view-left-container">
              {this.renderProfileDetails()}
              <div>
                <hr className="separator-line" />
                <h1 className="category-heading">Type of Employment</h1>
                <ul className="category-list-items">
                  {employmentTypesList.map(eachEmployment => (
                    <li
                      className="list-item"
                      key={eachEmployment.employmentTypeId}
                    >
                      <input
                        className="input-item"
                        id={eachEmployment.employmentTypeId}
                        type="checkbox"
                        value={eachEmployment.employmentTypeId}
                        onClick={this.filterEmploymentType}
                      />
                      <label htmlFor={eachEmployment.employmentTypeId}>
                        {eachEmployment.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <hr className="separator-line" />
                <h1 className="category-heading">Salary Range</h1>
                <ul className="category-list-items">
                  {salaryRangesList.map(salaryRange => (
                    <li className="list-item" key={salaryRange.salaryRangeId}>
                      <input
                        onClick={this.changeSalaryRange}
                        className="input-item"
                        id={salaryRange.salaryRangeId}
                        type="radio"
                        name="salaryRange"
                        value={salaryRange.salaryRangeId}
                      />
                      <label htmlFor={salaryRange.salaryRangeId}>
                        {salaryRange.label}
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="desktop-view-right-container">
              <div className="search-desktop-container">
                <input
                  type="search"
                  placeholder="Search"
                  className="search-input"
                  value={searchInput}
                  onChange={this.changeSearchInput}
                  onKeyDown={this.onEnterSearchInput}
                />
                <button
                  type="button"
                  data-testid="searchButton"
                  className="search-button"
                  onClick={this.searchUserInput}
                >
                  <BsSearch className="search-icon" />
                </button>
              </div>
              {this.renderAllJobs()}
            </div>
          </div>
        </div>
      </>
    )
  }
}

export default Jobs
