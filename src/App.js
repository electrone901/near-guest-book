import 'regenerator-runtime/runtime'
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import Big from 'big.js'
import Form from './components/Form'
import SignIn from './components/SignIn'
import Messages from './components/Messages'
import moment from 'moment'
import Footer from './footer/Footer'
import { Navbar } from './navbar/Navbar'

import {
  TextField,
  Container,
  StylesProvider,
  Typography,
  Button,
  IconButton,
  MenuItem,
} from '@material-ui/core'

const SUGGESTED_DONATION = '0'
const BOATLOAD_OF_GAS = Big(3)
  .times(10 ** 13)
  .toFixed()

const App = ({ contract, currentUser, nearConfig, wallet }) => {
  const [messages, setMessages] = useState([])
  const [displayForm, setDisplayForm] = useState(false)

  useEffect(async () => {
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm'
    const timeNow = moment(new Date(), DATE_TIME_FORMAT)

    // TODO: don't just fetch once; subscribe!
    const messageResp = await contract.getMessages()
    contract.getMessages().then(setMessages)

    // check if user already exist as a sende setDisplayForm(false)
    for (let ele of messageResp) {
      if (ele.sender == currentUser.accountId) {
        setDisplayForm(true)
      }
    }
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    //Change DATE_TIME_FORMAT by the format need
    const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm'
    const timeNow = moment(new Date(), DATE_TIME_FORMAT)
    const { fieldset, title, message, donation } = e.target.elements
    fieldset.disabled = true

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known

    contract
      .addMessage(
        { title: title.value, text: message.value, time: `${timeNow._d}` },
        BOATLOAD_OF_GAS,
        Big(donation.value || '0')
          .times(10 ** 24)
          .toFixed(),
      )
      .then(() => {
        contract.getMessages().then((messages) => {
          setMessages(messages)
          message.value = ''
          donation.value = SUGGESTED_DONATION
          fieldset.disabled = false
          message.focus()
        })
      })
  }

  const signIn = () => {
    wallet.requestSignIn(nearConfig.contractName, 'NEAR Guest Book')
  }

  const signOut = () => {
    wallet.signOut()
    // eslint-disable-next-line no-undef
    window.location.replace(window.location.origin + window.location.pathname)
  }

  return (
    <>
      <Navbar />
      <Container
        className="root-create-pet"
        style={{ minHeight: '78vh', paddingBottom: '3rem' }}
      >
        <main>
          <header>
            <h1> NEAR Events Proposals</h1>
            {currentUser ? '' : <button onClick={signIn}> Log in </button>}
          </header>

          {currentUser ? (
            <Form
              onSubmit={onSubmit}
              currentUser={currentUser}
              displayForm={displayForm}
            />
          ) : (
            <SignIn />
          )}
          {!!currentUser && !!messages.length && (
            <Messages messages={messages} />
          )}
        </main>
      </Container>
      <Footer />
    </>
  )
}

App.propTypes = {
  contract: PropTypes.shape({
    addMessage: PropTypes.func.isRequired,
    getMessages: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.shape({
    accountId: PropTypes.string.isRequired,
    balance: PropTypes.string.isRequired,
  }),
  nearConfig: PropTypes.shape({
    contractName: PropTypes.string.isRequired,
  }).isRequired,
  wallet: PropTypes.shape({
    requestSignIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
  }).isRequired,
}

export default App
