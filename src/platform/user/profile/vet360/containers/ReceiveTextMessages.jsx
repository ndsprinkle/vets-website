import React from 'react';
import { connect } from 'react-redux';
import isEqual from 'lodash/isEqual';
import pick from 'lodash/pick';

import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';

import { FIELD_NAMES } from '../constants';

import { selectVet360Field } from '../selectors';

class ReceiveTextMessages extends React.Component {  
  render() {
    if (!this.props.isTextable) return <div />;
    return (
      <div className="receive-text-messages">
        <div className="form-checkbox-buttons">
          <ErrorableCheckbox
            name="isTextPermitted"
            checked={this.props.checked}
            label={<span>Receive text messages (SMS) for VA health care appointment reminders.</span>}
          />
        </div>
      </div>
    );
  }
}

export function mapStateToProps(state, ownProps) {
  
  const { convertNextValueToCleanData } = ownProps;
  
  const mobilePhone = selectVet360Field(state, FIELD_NAMES.MOBILE_PHONE);
  
  const isTextable = mobilePhone.isTextable;
  
  const isTextPermitted = mobilePhone.isTextPermitted

  const checked = isTextable && isTextPermitted;
 
  return {
    mobilePhone,
    isTextable,
    isTextPermitted,
    checked,
  };
  
}

export default connect(
  mapStateToProps,
  null,
)(ReceiveTextMessages);

export { ReceiveTextMessages };
