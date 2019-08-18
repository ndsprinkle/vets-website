import React from 'react';
import { merge } from 'lodash';

import ErrorableTextInput from '@department-of-veterans-affairs/formation-react/ErrorableTextInput';
import ErrorableCheckbox from '@department-of-veterans-affairs/formation-react/ErrorableCheckbox';
import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import Vet360EditModal from '../base/EditModal';

export default class PhoneEditModal extends React.Component {
  // @todo Add propTypes

  onBlur = field => {
    this.props.onChange(this.props.field.value, field);
  };

  onChange = field => ({ value, dirty }) => {
    
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value,
    };

    this.props.onChange(newFieldValue, dirty);
  };

  onCheckboxChange = field => (value) => {
   
    const newFieldValue = {
      ...this.props.field.value,
      [field]: value,
    };
    
    this.props.onChange(newFieldValue, true);    
  }

  getInitialFormValues = () => {
    let defaultFieldValue;

    if (this.props.data) {
      defaultFieldValue = merge(this.props.data, {
        inputPhoneNumber:
          this.props.data &&
          [this.props.data.areaCode, this.props.data.phoneNumber].join(''),
      });
    } else {
      defaultFieldValue = {
        countryCode: '1',
        extension: '',
        inputPhoneNumber: '',
        isTextable: false,
        isTextPermitted: false,
      };
    }

    return defaultFieldValue;
  };

  renderCheckbox = () => {
    return (this.props.field.value.isTextable) 
      ? <ErrorableCheckbox
          label={<span>Receive text messages (SMS) for VA health care appointment reminders.</span>}
          field={{ value: this.props.field.value.isTextPermitted, dirty: false }}
          checked={this.props.field.value.isTextPermitted}
          onValueChange={this.onCheckboxChange('isTextPermitted')} /> 
      : null;
  };

  renderForm = () => (
    <div>
      <AlertBox isVisible status="info">
        <p>
          We can only support U.S. phone numbers right now. If you have an
          international number, please check back later.
        </p>
      </AlertBox>

      <ErrorableTextInput
        additionalClass="usa-only-phone"
        label="Number"
        charMax={14}
        required
        field={{ value: this.props.field.value.inputPhoneNumber, dirty: false }}
        onValueChange={this.onChange('inputPhoneNumber')}
        errorMessage={this.props.field.validations.inputPhoneNumber}
      />

      <ErrorableTextInput
        label="Extension"
        charMax={10}
        field={{ value: this.props.field.value.extension, dirty: false }}
        onValueChange={this.onChange('extension')}
      />
      
      {this.renderCheckbox()}
          
    </div>
  );

  render() {
    return (
      <Vet360EditModal
        getInitialFormValues={this.getInitialFormValues}
        render={this.renderForm}
        onBlur={this.onBlur}
        {...this.props}
      />
    );
  }
}
