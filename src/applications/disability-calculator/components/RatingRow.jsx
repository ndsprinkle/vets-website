import React from 'react';

export const RatingRow = props => {
  // componentDidMount() {
  //     this.ratingInput.focus()
  // }

  // componentDidUpdate() {
  //     this.ratingInput.focus()
  // }
  const ratingObj = props.ratingObj;
  const indx = props.indx;
  const handleChange = props.handleChange;
  const handleRemoveRating = props.handleRemoveRating;
  // eslint-disable-next-line no-console
  // console.log(ratingObj);

  return (
    <div className="rating vads-l-row">
      <div className="vads-l-col--2 vads-u-padding-right--2">
        <input
          type="text"
          min="0"
          onChange={e => handleChange(e, indx)}
          className="ratingInput"
          maxLength="3"
          value={ratingObj.rating.toString()}
          //   ref={input => (this.ratingInput = input)}
          // pattern="[\d]{5}(-[\d]{4})?"
          pattern="\d+"
          name="rating"
        />
      </div>
      <div className="vads-l-col--8">
        <input
          className="descriptionInput"
          name="description"
          onChange={e => handleChange(e, indx)}
          value={ratingObj.description}
        />
      </div>
      <div className="vads-l-col--2">
        {ratingObj.canDelete === true && (
          <div>
            <button
              type="button"
              onClick={handleRemoveRating(indx)}
              className="va-button-link delete-btn vads-u-padding--1p5"
            >
              <i className="fas fa-trash-alt vads-u-padding-right--0p5" />
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
