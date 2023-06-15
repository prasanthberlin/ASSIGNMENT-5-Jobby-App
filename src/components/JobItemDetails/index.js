import {Component} from 'react'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {AiFillStar} from 'react-icons/ai'

import {BiLinkExternal} from 'react-icons/bi'

import {MdLocationOn} from 'react-icons/md'

import {FaSuitcase} from 'react-icons/fa'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobData: {},
    similarJobsData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobData()
  }

  getFormattedData = data => ({
    companyLogoUrl: data.company_logo_url,
    employmentType: data.employment_type,
    id: data.id,
    jobDescription: data.job_description,
    location: data.location,
    rating: data.rating,
    title: data.title,
  })

  getJobData = async () => {
    const {match} = this.props
    const {params} = match
    const {id} = params

    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const fetchedData = await response.json()
      const jobData = fetchedData.job_details

      const updatedData = {
        companyLogoUrl: jobData.company_logo_url,
        companyWebsiteUrl: jobData.company_website_url,
        employmentType: jobData.employment_type,
        id: jobData.id,
        jobDescription: jobData.job_description,
        skills: jobData.skills,
        lifeAtCompany: jobData.life_at_company,
        location: jobData.location,
        rating: jobData.rating,
        packagePerAnnum: jobData.package_per_annum,
        title: jobData.title,
      }

      const updatedSimilarJobsData = fetchedData.similar_jobs.map(
        eachSimilarJob => this.getFormattedData(eachSimilarJob),
      )
      this.setState({
        jobData: updatedData,
        similarJobsData: updatedSimilarJobsData,
        apiStatus: apiStatusConstants.success,
      })
    }
    if (response.status === 404) {
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

  retryJobData = () => {
    this.getJobData()
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
        We cannot seem to find the page you are looking for
      </p>
      <button
        type="button"
        onClick={this.retryJobData}
        className="retry-button"
      >
        Retry
      </button>
    </div>
  )

  renderJobDetailsView = () => {
    const {jobData, similarJobsData} = this.state

    const skillsList = jobData.skills.map(eachSkill => ({
      imageUrl: eachSkill.image_url,
      name: eachSkill.name,
    }))

    const companyLife = {
      description: jobData.lifeAtCompany.description,
      imageUrl: jobData.lifeAtCompany.image_url,
    }

    return (
      <>
        <div className="job-details-view">
          <div className="company-logo-and-job-title">
            <img
              src={jobData.companyLogoUrl}
              className="company-logo"
              alt="job details company logo"
            />
            <div>
              <h1 className="job-title">{jobData.title}</h1>
              <div className="rating-container">
                <AiFillStar color="#fbbf24" size="20" />
                <p className="rating">{jobData.rating}</p>
              </div>
            </div>
          </div>
          <div className="job-details-container">
            <div className="location-employment-type-container">
              <div className="job-extra-details-container">
                <MdLocationOn size="20" />
                <p className="job-details-text">{jobData.location}</p>
              </div>
              <div className="job-extra-details-container">
                <FaSuitcase size="18" />
                <p className="job-details-text">{jobData.employmentType}</p>
              </div>
            </div>
            <p className="job-package-text">{jobData.packagePerAnnum}</p>
          </div>
          <hr className="separator-line" />
          <div className="description-visit-container">
            <h1>Description</h1>
            <a className="visit-link" href={jobData.companyWebsiteUrl}>
              <p className="visit-text">Visit</p>
              <BiLinkExternal size="15" />
            </a>
          </div>
          <p className="job-description">{jobData.jobDescription}</p>
          <h1 className="main-topic-heading">Skills</h1>
          <ul className="skills-list-item">
            {skillsList.map(skill => (
              <li key={skill.name} className="skill-item">
                <img
                  src={skill.imageUrl}
                  alt={skill.name}
                  className="skill-logo"
                />
                <p>{skill.name}</p>
              </li>
            ))}
          </ul>
          <h1 className="main-topic-heading">Life at Company</h1>
          <div className="life-at-company-container">
            <p className="company-description">{companyLife.description}</p>
            <img
              src={companyLife.imageUrl}
              className="life-at-company"
              alt="life at company"
            />
          </div>
        </div>
        <h1 className="similar-job-heading">Similar Jobs</h1>
        <ul className="similar-jobs-list-item">
          {similarJobsData.map(eachJob => (
            <li key={eachJob.id} className="similar-job-item">
              <div className="company-logo-and-job-title">
                <img
                  src={eachJob.companyLogoUrl}
                  className="company-logo"
                  alt="similar job company logo"
                />
                <div>
                  <h1 className="job-title">{eachJob.title}</h1>
                  <div className="rating-container">
                    <AiFillStar color="#fbbf24" size="20" />
                    <p className="rating">{eachJob.rating}</p>
                  </div>
                </div>
              </div>

              <div className="description-visit-container">
                <h1>Description</h1>
              </div>
              <p className="job-description">{eachJob.jobDescription}</p>
              <div className="job-details-container">
                <div className="location-employment-type-container">
                  <div className="job-extra-details-container">
                    <MdLocationOn size="20" />
                    <p className="job-details-text">{eachJob.location}</p>
                  </div>
                  <div className="job-extra-details-container">
                    <FaSuitcase size="18" />
                    <p className="job-details-text">{eachJob.employmentType}</p>
                  </div>
                </div>
                <p className="job-package-text">{eachJob.packagePerAnnum}</p>
              </div>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderJobDetails = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderJobDetailsView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-item-details-container">
          {this.renderJobDetails()}
        </div>
      </>
    )
  }
}

export default JobItemDetails
