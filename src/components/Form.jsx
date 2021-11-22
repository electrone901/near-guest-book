import React from 'react'
import PropTypes from 'prop-types'
import Big from 'big.js'
import Card from '@material-ui/core/Card'

export default function Form({ onSubmit, currentUser, displayForm }) {
  console.log('🚀 ~ file: Form.jsx ~ line 7 ~ Form ~ displayForm', displayForm)
  return (
    <Card className="form-card">
      <form onSubmit={onSubmit} className="form-content">
        <fieldset id="fieldset">
          <p style={{ textAlign: 'justify' }}>
            Enter your suggestions for a NEAR event, if we think is a good idea
            we might go ahead and make it. You are allow to make only one
            proposal.
          </p>
          {/* <p>Sign the guest book, {currentUser.accountId}!</p> */}

          <p className="highlight">
            {/* <label htmlFor="message">Tittle:</label> */}
            <input
              autoComplete="off"
              autoFocus
              id="title"
              placeholder="Tittle"
              required
            />
          </p>

          <p className="highlight">
            {/* <label htmlFor="message">Message:</label> */}
            <input
              autoComplete="off"
              autoFocus
              id="message"
              placeholder="I would like to see more workshops on smart contracts"
              required
            />
          </p>
          <p>
            <label htmlFor="donation">Donation (optional):</label>
            <input
              autoComplete="off"
              defaultValue={'0'}
              id="donation"
              max={Big(currentUser.balance).div(10 ** 24)}
              min="0"
              step="0.01"
              type="number"
            />
            <span title="NEAR Tokens">Ⓝ</span>
          </p>
          <button type="submit" className="btn-sign" disabled={displayForm}>
            Submit
          </button>
        </fieldset>
      </form>
    </Card>
  )
}

Form.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
}
