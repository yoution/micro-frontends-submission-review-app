/**
 * Challenge Progress
 *
 * Shows Progress the challenge.
 */
import React from "react";
import config from "../../../../../config";
import ProgressBar from "../../../../components/ProgressBar";
import PT from "prop-types";
import "./styles.module.scss";

export const getTCChallengeURL = (challengeId) => `${config.TOPCODER_COMMUNITY_WEBSITE_URL}/challenges/${challengeId}`

const ChallengeProgress = ({ challengeId, progress, purse, registers, submitters }) => {
  const purseBackgroundColors = ["#fce217", "#d1d0cf", "#da8f64"];

  const challengeURL = getTCChallengeURL(challengeId)

  return (
    <div styleName="challenge-progress-container">
      <div styleName="purse-stats-wrapper">
        <div styleName="purse-wrapper">
          {purse &&
            purse.map((rank, index) => (
              <div
                key={index}
                styleName="purse-value"
                style={{ borderColor: purseBackgroundColors[index] }}
              >
                <span styleName="purse-rank">{rank.position}</span>
                <span styleName="purse-money">{rank.money.toLocaleString()}</span>
              </div>
            ))}
        </div>
        <div styleName="stats-wrapper">
          <span>{registers} Registrants</span>
          <span>{submitters} Submissions</span>
        </div>
      </div>
      <div styleName="progress-view-wrapper">
        <ProgressBar progress={progress} />
        <div styleName="view-challenge-wrapper">
          <a href={challengeURL} styleName="view-challenge">VIEW CHALLENGE</a>
        </div>
      </div>
    </div>
  );
};

ChallengeProgress.propTypes = {
  progress: PT.object,
  purse: PT.array,
  registers: PT.number,
  challengeId: PT.number,
  submitters: PT.number,
};

export default ChallengeProgress;
