import backIcon from '../assets/back.svg';

const BackButton = ({ onClick }) => (
  <button className="back-button" onClick={onClick}>
    <img src={backIcon} alt="Back" />
    Back
  </button>
);

export default BackButton;
