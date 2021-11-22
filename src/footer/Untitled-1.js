
import moment from 'moment';

const onSubmit = (e) => {
    e.preventDefault();
     //Change DATE_TIME_FORMAT by the format need
     const DATE_TIME_FORMAT = 'YYYY-MM-DDTHH:mm'; 
     const timeNow = moment(new Date(), DATE_TIME_FORMAT);
     console.log("🚀 ~ file: App.js ~ line 32 ~ onSubmit ~ time", timeNow._d)
    
    const { fieldset, message, donation } = e.target.elements;

    fieldset.disabled = true;

    // TODO: optimistically update page with new message,
    // update blockchain data in background
    // add uuid to each message, so we know which one is already known
    
    contract.addMessage(
      { text: message.value, time:timeNow._d },
      BOATLOAD_OF_GAS,
      Big(donation.value || '0').times(10 ** 24).toFixed()
    ).then(() => {
      contract.getMessages().then(messages => {
        setMessages(messages);
        message.value = '';
        donation.value = SUGGESTED_DONATION;
        fieldset.disabled = false;
        message.focus();
      });
    });
  };