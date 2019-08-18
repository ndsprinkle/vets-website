import React from 'react';
import { connect } from 'react-redux';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';
import ReceiveTextMessages from 'vet360/containers/ReceiveTextMessages';
import PhoneField from './PhoneField';
import { FIELD_NAMES } from '../constants';
import { selectVet360Field } from '../selectors';

function MobilePhone({shouldDisplayReceiveTextMessages, isEnrolledInHealthcare}) {
  return (
    <>
      <PhoneField
        title="Mobile phone number"
        fieldName={FIELD_NAMES.MOBILE_PHONE}
      />
      {shouldDisplayReceiveTextMessages && isEnrolledInHealthcare &&
        <ReceiveTextMessages />
      }
    </>
  );
}

const mapStateToProps = (state, ownProps) => {
  const data = selectVet360Field(state, FIELD_NAMES.MOBILE_PHONE);
  const shouldDisplayReceiveTextMessages = data;
  // TODO: get the real flag...
  const isEnrolledInHealthcare = true;
  return {
    shouldDisplayReceiveTextMessages,
    isEnrolledInHealthcare,
  };
};

export default connect(
  mapStateToProps,
)(MobilePhone);
