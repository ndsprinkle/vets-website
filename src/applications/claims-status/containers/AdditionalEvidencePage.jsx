import React from 'react';
import Scroll from 'react-scroll';
import { withRouter, Link } from 'react-router';
import { connect } from 'react-redux';
import AskVAQuestions from '../components/AskVAQuestions';
import AddFilesForm from '../components/AddFilesForm';
import LoadingIndicator from '@department-of-veterans-affairs/formation-react/LoadingIndicator';
import Notification from '../components/Notification';
import EvidenceWarning from '../components/EvidenceWarning';
import ClaimsBreadcrumbs from '../components/ClaimsBreadcrumbs';
import { scrollToTop, setPageFocus, setUpPage } from '../utils/page';
import { getScrollOptions } from '../../../platform/utilities/ui';

import {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  showMailOrFaxModal,
  cancelUpload,
  getClaimDetail,
  setFieldsDirty,
  resetUploads,
  clearNotification,
} from '../actions/index.jsx';

const scrollToError = () => {
  const options = getScrollOptions({ offset: -25 });
  Scroll.scroller.scrollTo('uploadError', options);
};
const Element = Scroll.Element;

class AdditionalEvidencePage extends React.Component {
  componentDidMount() {
    this.props.resetUploads();
    document.title = 'Additional Evidence';
    if (!this.props.loading) {
      setUpPage();
    } else {
      scrollToTop();
    }
  }
  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(props) {
    if (props.uploadComplete) {
      this.goToFilesPage();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.message && !prevProps.message) {
      scrollToError();
    }
    if (!this.props.loading && prevProps.loading) {
      setPageFocus();
    }
  }
  componentWillUnmount() {
    if (!this.props.uploadComplete) {
      this.props.clearNotification();
    }
  }
  goToFilesPage() {
    this.props.getClaimDetail(this.props.claim.id);
    this.props.router.push(`your-claims/${this.props.claim.id}/files`);
  }
  render() {
    const claimsPath = `your-claims/${this.props.params.id}/files`;
    const filesPath = `your-claims/${this.props.params.id}/additional-evidence`;
    let content;

    if (this.props.loading) {
      content = (
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs>
                <Link to={claimsPath}>Status details</Link>
                <Link to={filesPath}>Additional evidence</Link>
              </ClaimsBreadcrumbs>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              <LoadingIndicator
                setFocus
                message="Loading your claim information..."
              />
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
              <AskVAQuestions />
            </div>
          </div>
        </div>
      );
    } else {
      const message = this.props.message;

      content = (
        <div className="vads-l-grid-container large-screen:vads-u-padding-x--0">
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12">
              <ClaimsBreadcrumbs>
                <Link to={claimsPath}>Status details</Link>
                <Link to={filesPath}>Additional evidence</Link>
              </ClaimsBreadcrumbs>
            </div>
          </div>
          <div className="vads-l-row vads-u-margin-x--neg2p5">
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--8">
              <div className="claim-container">
                {message && (
                  <div>
                    <Element name="uploadError" />
                    <Notification
                      title={message.title}
                      body={message.body}
                      type={message.type}
                    />
                  </div>
                )}
                <h1 className="claims-header">Additional evidence</h1>
                <EvidenceWarning />
                <AddFilesForm
                  field={this.props.uploadField}
                  progress={this.props.progress}
                  uploading={this.props.uploading}
                  files={this.props.files}
                  showMailOrFax={this.props.showMailOrFax}
                  backUrl={this.props.lastPage || filesPath}
                  onSubmit={() =>
                    this.props.submitFiles(
                      this.props.claim.id,
                      null,
                      this.props.files,
                    )
                  }
                  onAddFile={this.props.addFile}
                  onRemoveFile={this.props.removeFile}
                  onFieldChange={this.props.updateField}
                  onShowMailOrFax={this.props.showMailOrFaxModal}
                  onCancel={this.props.cancelUpload}
                  onDirtyFields={this.props.setFieldsDirty}
                />
              </div>
            </div>
            <div className="vads-l-col--12 vads-u-padding-x--2p5 medium-screen:vads-l-col--4 help-sidebar">
              <AskVAQuestions />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div>
        <div name="topScrollElement" />
        {content}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const claimsState = state.disability.status;
  return {
    loading: claimsState.claimDetail.loading,
    claim: claimsState.claimDetail.detail,
    files: claimsState.uploads.files,
    uploading: claimsState.uploads.uploading,
    progress: claimsState.uploads.progress,
    uploadError: claimsState.uploads.uploadError,
    uploadComplete: claimsState.uploads.uploadComplete,
    uploadField: claimsState.uploads.uploadField,
    showMailOrFax: claimsState.uploads.showMailOrFax,
    lastPage: claimsState.routing.lastPage,
    message: claimsState.notifications.message,
  };
}

const mapDispatchToProps = {
  addFile,
  removeFile,
  submitFiles,
  updateField,
  showMailOrFaxModal,
  cancelUpload,
  getClaimDetail,
  setFieldsDirty,
  resetUploads,
  clearNotification,
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps,
  )(AdditionalEvidencePage),
);

export { AdditionalEvidencePage };
