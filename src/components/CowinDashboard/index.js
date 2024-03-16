import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByGender from '../VaccinationByGender'
import VaccinationByAge from '../VaccinationByAge'
import './index.css'

const apiStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'LOADING',
}

class CowinDashboard extends Component {
  state = {data: {}, apiStatus: apiStatusConstant.initial}

  componentDidMount() {
    this.getCowinData()
  }

  onSuccessFulResponse = data => {
    this.setState({data, apiStatus: apiStatusConstant.success})
  }

  onFailureResponse = () => {
    this.setState({apiStatus: apiStatusConstant.failure})
  }

  getCowinData = async () => {
    this.setState({apiStatus: apiStatusConstant.loading})

    const url = 'https://apis.ccbp.in/covid-vaccination-data'
    const response = await fetch(url)
    const data = await response.json()
    if (response.ok === true) {
      const last7DaysVaccination = data.last_7_days_vaccination.map(
        eachItem => ({
          vaccineDate: eachItem.vaccine_date,
          dose1: eachItem.dose_1,
          dose2: eachItem.dose_2,
        }),
      )
      const vaccinationByAge = data.vaccination_by_age.map(eachItem => ({
        age: eachItem.age,
        count: eachItem.count,
      }))

      const vaccinationByGender = data.vaccination_by_gender.map(eachItem => ({
        count: eachItem.count,
        gender: eachItem.gender,
      }))

      const updatedCowinData = {
        last7DaysVaccination,
        vaccinationByAge,
        vaccinationByGender,
      }

      this.onSuccessFulResponse(updatedCowinData)
    } else {
      this.onFailureResponse()
    }
  }

  renderSuccessView = () => {
    const {data} = this.state
    const {last7DaysVaccination, vaccinationByAge, vaccinationByGender} = data

    return (
      <>
        <VaccinationCoverage last7DaysVaccination={last7DaysVaccination} />
        <VaccinationByGender vaccinationByGender={vaccinationByGender} />
        <VaccinationByAge vaccinationByAge={vaccinationByAge} />
      </>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )

  renderFailureView = () => (
    <div className="failure-cont">
      <img
        className="failure-img"
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png "
        alt="failure view"
      />
      <h1 className="failure-para">Something went wrong</h1>
    </div>
  )

  render() {
    const {apiStatus} = this.state

    const renderActiveView = () => {
      switch (apiStatus) {
        case apiStatusConstant.success:
          return this.renderSuccessView()
        case apiStatusConstant.failure:
          return this.renderFailureView()
        case apiStatusConstant.loading:
          return this.renderLoadingView()
        default:
          return null
      }
    }

    return (
      <div className="bg-cont">
        <div className="cont">
          <div className="web-logo-cont">
            <img
              className="web-logo"
              src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
              alt="website logo"
            />
            <p className="web-logo-para">Co-WIN</p>
          </div>
          <h1 className="main-h1">CoWIN Vaccination in India</h1>
          {renderActiveView()}
        </div>
      </div>
    )
  }
}

export default CowinDashboard
