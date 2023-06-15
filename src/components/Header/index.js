import {Link, withRouter} from 'react-router-dom'
import Cookies from 'js-cookie'
import {FaSuitcase} from 'react-icons/fa'
import {FiLogOut} from 'react-icons/fi'
import {AiFillHome} from 'react-icons/ai'
import './index.css'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props

    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <nav className="nav-header">
      <div className="nav-bar-mobile-logo-container">
        <Link to="/">
          <img
            className="website-logo-header"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <ul className="mobile-icon-container">
          <li>
            <Link to="/" className="nav-link">
              <AiFillHome size="25" />
            </Link>
          </li>
          <li>
            <Link to="/jobs" className="nav-link">
              <FaSuitcase size="25" />
            </Link>
          </li>
          <li>
            <button
              type="button"
              className="nav-mobile-btn"
              onClick={onClickLogout}
            >
              <FiLogOut size="25" />
            </button>
          </li>
        </ul>
      </div>

      <div className="nav-bar-large-container">
        <Link to="/">
          <img
            className="website-logo-header"
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
          />
        </Link>
        <div>
          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

            <li className="nav-menu-item">
              <Link to="/jobs" className="nav-link">
                Jobs
              </Link>
            </li>
          </ul>
        </div>
        <button
          type="button"
          className="logout-desktop-btn"
          onClick={onClickLogout}
        >
          Logout
        </button>
      </div>
    </nav>
  )
}

export default withRouter(Header)
